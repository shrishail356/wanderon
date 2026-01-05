output "container_registry_name" {
  value       = data.azurerm_container_registry.acr.name
  description = "Name of the Azure Container Registry"
}

output "container_registry_login_server" {
  value       = data.azurerm_container_registry.acr.login_server
  description = "Login server URL for the Azure Container Registry"
}

output "container_app_name" {
  value       = azurerm_container_app.backend.name
  description = "Name of the Container App"
}

output "container_app_url" {
  value       = "https://${azurerm_container_app.backend.ingress[0].fqdn}"
  description = "URL of the Container App"
}

output "container_app_fqdn" {
  value       = azurerm_container_app.backend.ingress[0].fqdn
  description = "Fully qualified domain name of the Container App"
}

output "managed_identity_client_id" {
  value       = azurerm_user_assigned_identity.backend_identity.client_id
  description = "Client ID of the managed identity"
}

output "managed_identity_principal_id" {
  value       = azurerm_user_assigned_identity.backend_identity.principal_id
  description = "Principal ID of the managed identity"
}

