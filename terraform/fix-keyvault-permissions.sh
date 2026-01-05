#!/bin/bash
# Fix Key Vault permissions to allow storing secrets
# This grants your user account the necessary permissions

KEY_VAULT_NAME="wanderon-kv"
RESOURCE_GROUP="rg-wanderon"

echo "🔐 Fixing Key Vault permissions..."
echo ""

# Check if Azure CLI is logged in
if ! az account show &> /dev/null; then
    echo "❌ Not logged in to Azure CLI. Please run 'az login' first."
    exit 1
fi

# Get current user's object ID
CURRENT_USER=$(az account show --query user.name -o tsv)
CURRENT_USER_OBJECT_ID=$(az ad signed-in-user show --query id -o tsv)

echo "Current user: $CURRENT_USER"
echo "Object ID: $CURRENT_USER_OBJECT_ID"
echo ""

# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)
KEY_VAULT_SCOPE="/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEY_VAULT_NAME"

echo "Key Vault scope: $KEY_VAULT_SCOPE"
echo ""

# Grant Key Vault Secrets Officer role (allows set/get/list/delete secrets)
echo "🔑 Granting 'Key Vault Secrets Officer' role..."
az role assignment create \
  --role "Key Vault Secrets Officer" \
  --assignee "$CURRENT_USER_OBJECT_ID" \
  --scope "$KEY_VAULT_SCOPE" \
  --output none

if [ $? -eq 0 ]; then
    echo "✅ Role assignment created successfully!"
    echo ""
    echo "⏳ Waiting 30 seconds for RBAC propagation..."
    sleep 30
    echo "✅ Ready to store secrets!"
    echo ""
    echo "You can now run: ./store-keyvault-secrets.sh"
else
    echo ""
    echo "⚠️  Role assignment may already exist or you may need admin permissions."
    echo "Checking existing role assignments..."
    az role assignment list \
      --scope "$KEY_VAULT_SCOPE" \
      --assignee "$CURRENT_USER_OBJECT_ID" \
      --query "[].{Role:roleDefinitionName}" \
      --output table
    
    echo ""
    echo "If you see 'Key Vault Secrets Officer' above, permissions are already set."
    echo "If not, you may need to contact your Azure administrator."
fi

echo ""
echo "🎉 Permission check complete!"

