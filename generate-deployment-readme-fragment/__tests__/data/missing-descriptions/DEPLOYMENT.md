## Deploy from Azure


You will need to create a service principal in order to use the 'Deploy from Azure' buttons.


For detailed instructions on deploying from Azure, including how to setup the service principal, see [Consuming: Deploy from Azure](../../consuming.md#deploy-from-azure)

### Simple deployment


<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fendjin%2FCNAB.Quickstarts%2Fmaster%2Fporter%2Fsql-server-always-on%2Fazuredeploy-simple.json" target="_blank"><img src="https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/images/Deploy-from-Azure.png"/></a>

### Advanced deployment


<a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fendjin%2FCNAB.Quickstarts%2Fmaster%2Fporter%2Fsql-server-always-on%2Fazuredeploy-advanced.json" target="_blank"><img src="https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/images/Deploy-from-Azure.png"/></a>


## Deploy from Cloud Shell


For detailed instructions on deploying from Cloud Shell, including how to setup the Cloud Shell environment, see [Consuming: Deploy from Cloud Shell](../../consuming.md#deploy-from-cloud-shell)


```porter install --tag cnabquickstarts.azurecr.io/porter/airflow:0.1.0 -d azure```


## Parameters and Credentials

 | Name | Description | Default | Required | 
 | --- | --- | --- | --- | 
 | airflow_name |  |  | No
host |  |  | Yes
ingress_class |  |  | No
kubeconfig |  |  | Yes
namespace |  |  | No
porter-debug | Print debug information from Porter when executing the bundle |  | No | 
