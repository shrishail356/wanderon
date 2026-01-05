# Azure Deployment Guide - WanderOn Expense Tracker Backend

This guide will help you deploy the WanderOn Expense Tracker backend to Azure Container Apps using Terraform.

## 📋 Prerequisites

1. **Azure CLI** installed and logged in
   ```bash
   az login
   ```

2. **Terraform** installed (v1.0+)
   ```bash
   terraform version
   ```

3. **Docker** installed and running
   ```bash
   docker --version
   ```

4. **Azure Providers Registered**
   ```bash
   az provider register --namespace Microsoft.ContainerService
   az provider register --namespace Microsoft.Web
   az provider register --namespace Microsoft.KeyVault
   az provider register --namespace Microsoft.App  # Required for Container Apps
   az provider register --namespace Microsoft.ContainerRegistry  # Required for ACR
   ```

5. **Existing Resources**
   - Resource Group: `rg-wanderon`
   - Key Vault: `wanderon-kv`
   - Azure Container Registry: `acrwanderon` (already created, referenced as data source)

## 🚀 Deployment Steps

### Step 1: Store Secrets in Key Vault

First, store all your environment variables in Azure Key Vault:

```bash
cd terraform
chmod +x store-keyvault-secrets.sh
./store-keyvault-secrets.sh
```

This will store all the required secrets:
- NODE_ENV
- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- COOKIE_SECURE
- COOKIE_SAME_SITE
- CORS_ORIGIN
- RATE_LIMIT_WINDOW_MS
- RATE_LIMIT_MAX_REQUESTS

### Step 2: Build and Push Docker Image

**CRITICAL**: You must build for `linux/amd64` platform for Azure Container Apps!

```bash
cd terraform
chmod +x build-and-push.sh
./build-and-push.sh
```

This script will:
1. Login to Azure Container Registry
2. Build Docker image for `linux/amd64` platform
3. Tag the image
4. Push to ACR

**Important Notes:**
- The build uses `--platform linux/amd64` which is **required** for Azure
- The build uses `--no-cache` to ensure a clean build
- The image is tagged as `wanderon-backend:latest`

### Step 3: Test Docker Image Locally (Optional but Recommended)

Before deploying, test the Docker image locally:

```bash
# Build locally
cd ../backend
docker build --platform linux/amd64 -t wanderon-backend:test .

# Run locally
docker run -p 4000:4000 \
  -e NODE_ENV=production \
  -e PORT=4000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  wanderon-backend:test

# Test health endpoint
curl http://localhost:4000/api/health
```

### Step 4: Deploy with Terraform

```bash
cd terraform
chmod +x deploy.sh
./deploy.sh
```

Or manually:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

### Step 5: Verify Deployment

After deployment, Terraform will output the Container App URL. Test it:

```bash
# Get the URL from terraform output
terraform output container_app_url

# Test health endpoint
curl https://<your-container-app-url>/api/health
```

## 📁 Project Structure

```
terraform/
├── main.tf                    # Main Terraform configuration
├── outputs.tf                 # Output values
├── .gitignore                # Terraform ignore file
├── store-keyvault-secrets.sh # Script to store secrets in KV
├── build-and-push.sh         # Script to build and push Docker image
├── deploy.sh                 # Script to deploy with Terraform
└── README.md                 # This file
```

## 🔧 Terraform Resources Created

1. **Azure Container Registry (ACR)**
   - Name: `acrwanderon`
   - **Note**: ACR already exists and is referenced as a data source (not created by Terraform)

2. **Container App Environment**
   - Name: `wanderon-env`
   - Includes Log Analytics Workspace

3. **Managed Identity**
   - Name: `wanderon-backend-identity`
   - Used for ACR pull and Key Vault access

4. **Container App**
   - Name: `wanderon-backend`
   - Port: 4000
   - Min replicas: 1
   - Max replicas: 3

## 🔐 Security

- All secrets are stored in Azure Key Vault
- Managed Identity is used for authentication (no passwords in code)
- Secrets are referenced from Key Vault in Container App
- ACR uses managed identity for pull authentication

## 🐛 Troubleshooting

### Docker Build Fails

- Ensure Docker is running
- Check that you're building for `linux/amd64` platform
- Verify Dockerfile is correct

### Terraform Apply Fails

- Check that all secrets are stored in Key Vault
- Verify resource group and key vault names are correct
- Ensure you're logged in to Azure CLI
- Check RBAC permissions

### Container App Won't Start

- Check logs in Azure Portal
- Verify all environment variables are set correctly
- Check that MongoDB connection string is valid
- Ensure JWT_SECRET is at least 32 characters

### Image Pull Fails

- Verify managed identity has ACR Pull role
- Check that image was pushed successfully
- Verify ACR name and image name match

## 📝 Updating the Deployment

### Update Docker Image

1. Make changes to backend code
2. Rebuild and push image:
   ```bash
   ./build-and-push.sh
   ```
3. Restart Container App (Terraform will auto-detect new image)

### Update Environment Variables

1. Update secrets in Key Vault:
   ```bash
   az keyvault secret set --vault-name wanderon-kv --name SECRET-NAME --value "new-value"
   ```
2. Restart Container App to pick up new values

### Update Terraform Configuration

1. Make changes to `main.tf`
2. Run:
   ```bash
   terraform plan
   terraform apply
   ```

## 🔗 Useful Commands

```bash
# View Container App logs
az containerapp logs show --name wanderon-backend --resource-group rg-wanderon --follow

# Restart Container App
az containerapp revision restart --name wanderon-backend --resource-group rg-wanderon

# View Container App details
az containerapp show --name wanderon-backend --resource-group rg-wanderon

# List Container App revisions
az containerapp revision list --name wanderon-backend --resource-group rg-wanderon
```

## 📊 Monitoring

- Logs are available in Log Analytics Workspace: `wanderon-law`
- Metrics are available in Azure Portal under Container App
- Health checks run every 30 seconds

## ✅ Post-Deployment Checklist

- [ ] Container App is running
- [ ] Health endpoint responds: `/api/health`
- [ ] Can access API endpoints
- [ ] Logs are being collected
- [ ] Secrets are properly configured
- [ ] CORS is configured correctly
- [ ] Update frontend `NEXT_PUBLIC_API_URL` to Container App URL

## 🆘 Support

If you encounter issues:
1. Check Azure Portal for error messages
2. Review Container App logs
3. Verify all secrets in Key Vault
4. Check Terraform state for resource status

---

**Built with ❤️ for secure, scalable deployments**

