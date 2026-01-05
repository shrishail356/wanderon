terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.111.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.9"
    }
  }
}

provider "azurerm" {
  features {}
}

# Data sources for existing resources
data "azurerm_resource_group" "main" {
  name = "rg-wanderon"
}

data "azurerm_key_vault" "kv" {
  name                = "wanderon-kv"
  resource_group_name = data.azurerm_resource_group.main.name
}

data "azurerm_client_config" "current" {}

# Get all secrets from Key Vault
data "azurerm_key_vault_secret" "node_env" {
  name         = "NODE-ENV"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "port" {
  name         = "PORT"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "mongodb_uri" {
  name         = "MONGODB-URI"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "jwt_secret" {
  name         = "JWT-SECRET"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "jwt_expires_in" {
  name         = "JWT-EXPIRES-IN"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "cookie_secure" {
  name         = "COOKIE-SECURE"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "cookie_same_site" {
  name         = "COOKIE-SAME-SITE"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "cors_origin" {
  name         = "CORS-ORIGIN"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "rate_limit_window_ms" {
  name         = "RATE-LIMIT-WINDOW-MS"
  key_vault_id = data.azurerm_key_vault.kv.id
}

data "azurerm_key_vault_secret" "rate_limit_max_requests" {
  name         = "RATE-LIMIT-MAX-REQUESTS"
  key_vault_id = data.azurerm_key_vault.kv.id
}

# ============================================================================
# AZURE CONTAINER REGISTRY (ACR) - Using data source since ACR already exists
# ============================================================================

data "azurerm_container_registry" "acr" {
  name                = "acrwanderon"
  resource_group_name = data.azurerm_resource_group.main.name
}

# ============================================================================
# CONTAINER APP ENVIRONMENT
# ============================================================================

resource "azurerm_container_app_environment" "env" {
  name                       = "wanderon-env"
  resource_group_name        = data.azurerm_resource_group.main.name
  location                   = data.azurerm_resource_group.main.location
  log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id

  tags = {
    environment = "production"
    project     = "wanderon-expense-tracker"
  }
}

# Log Analytics Workspace for Container App Environment
resource "azurerm_log_analytics_workspace" "law" {
  name                = "wanderon-law"
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = {
    environment = "production"
    project     = "wanderon-expense-tracker"
  }
}

# ============================================================================
# MANAGED IDENTITY
# ============================================================================

resource "azurerm_user_assigned_identity" "backend_identity" {
  name                = "wanderon-backend-identity"
  location            = data.azurerm_resource_group.main.location
  resource_group_name = data.azurerm_resource_group.main.name

  tags = {
    environment = "production"
    project     = "wanderon-expense-tracker"
  }
}

# ============================================================================
# ROLE ASSIGNMENTS
# ============================================================================

# ACR Pull Role
resource "azurerm_role_assignment" "backend_acr_pull" {
  scope                = data.azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_user_assigned_identity.backend_identity.principal_id
}

# Key Vault Access
resource "azurerm_role_assignment" "backend_keyvault" {
  scope                = data.azurerm_key_vault.kv.id
  role_definition_name = "Key Vault Secrets User"
  principal_id         = azurerm_user_assigned_identity.backend_identity.principal_id
}

# Key Vault Access Policy
resource "azurerm_key_vault_access_policy" "backend_kv_policy" {
  key_vault_id = data.azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_user_assigned_identity.backend_identity.principal_id

  secret_permissions = ["Get", "List"]
}

# ============================================================================
# WAIT FOR RBAC PROPAGATION
# ============================================================================

resource "time_sleep" "wait_for_rbac" {
  depends_on = [
    azurerm_role_assignment.backend_acr_pull,
    azurerm_role_assignment.backend_keyvault,
    azurerm_key_vault_access_policy.backend_kv_policy
  ]

  create_duration = "150s"  # 2.5 minutes wait for RBAC propagation
}

# ============================================================================
# CONTAINER APP
# ============================================================================

resource "azurerm_container_app" "backend" {
  name                         = "wanderon-backend"
  container_app_environment_id = azurerm_container_app_environment.env.id
  resource_group_name          = data.azurerm_resource_group.main.name
  revision_mode                = "Single"

  identity {
    type = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.backend_identity.id]
  }

  registry {
    identity = azurerm_user_assigned_identity.backend_identity.id
    server   = data.azurerm_container_registry.acr.login_server
  }

  ingress {
    external_enabled = true
    target_port      = 4000
    transport        = "auto"
    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = 1
    max_replicas = 3

    container {
      name   = "backend"
      image  = "${data.azurerm_container_registry.acr.login_server}/wanderon-backend:latest"
      cpu    = 0.5
      memory = "1.0Gi"

      env {
        name  = "NODE_ENV"
        value = data.azurerm_key_vault_secret.node_env.value
      }
      env {
        name  = "PORT"
        value = data.azurerm_key_vault_secret.port.value
      }
      env {
        name  = "MONGODB_URI"
        secret_name = "mongodb-uri"
      }
      env {
        name  = "JWT_SECRET"
        secret_name = "jwt-secret"
      }
      env {
        name  = "JWT_EXPIRES_IN"
        value = data.azurerm_key_vault_secret.jwt_expires_in.value
      }
      env {
        name  = "COOKIE_SECURE"
        value = data.azurerm_key_vault_secret.cookie_secure.value
      }
      env {
        name  = "COOKIE_SAME_SITE"
        value = data.azurerm_key_vault_secret.cookie_same_site.value
      }
      env {
        name  = "CORS_ORIGIN"
        value = data.azurerm_key_vault_secret.cors_origin.value
      }
      env {
        name  = "RATE_LIMIT_WINDOW_MS"
        value = data.azurerm_key_vault_secret.rate_limit_window_ms.value
      }
      env {
        name  = "RATE_LIMIT_MAX_REQUESTS"
        value = data.azurerm_key_vault_secret.rate_limit_max_requests.value
      }
    }
  }

  secret {
    name  = "mongodb-uri"
    value = data.azurerm_key_vault_secret.mongodb_uri.value
  }

  secret {
    name  = "jwt-secret"
    value = data.azurerm_key_vault_secret.jwt_secret.value
  }

  depends_on = [
    azurerm_user_assigned_identity.backend_identity,
    azurerm_role_assignment.backend_acr_pull,
    azurerm_role_assignment.backend_keyvault,
    azurerm_key_vault_access_policy.backend_kv_policy,
    time_sleep.wait_for_rbac
  ]

  lifecycle {
    ignore_changes = [template[0].container[0].image]
  }

  tags = {
    environment = "production"
    project     = "wanderon-expense-tracker"
  }
}

