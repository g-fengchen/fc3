$ErrorActionPreference = "Stop"

$env:fc_component_function_name = "node16-$($env:OS)-$($env:PROCESSOR_ARCHITECTURE)-$($env:RANDSTR)"

Write-Host "test command instance/version/alias/concurrency/provision ..."
s deploy -y
s invoke

s instance list

s version publish --description test
s version list
s version remove --version-id latest  -y
s version publish --description test

s concurrency put --reserved-concurrency 80
s concurrency get
s concurrency remove -y

s alias list
s alias publish --alias-name test --version-id latest
s alias get --alias-name test
s alias list
s alias list --table
s alias remove --alias-name test  -y
s alias publish --alias-name test --version-id latest

s provision put --qualifier test --ac --target 2 --scheduled-actions '[{"name":"scheduled-actions","startTime":"2023-08-15T02:04:00.000Z","endTime":"2033-08-15T02:04:00.000Z","target":1,"scheduleExpression":"cron(0 0 4 * * *)"}]' --target-tracking-policies '[{"name":"target-tracking-policies","startTime":"2023-08-15T02:05:00.000Z","endTime":"2033-08-15T02:05:00.000Z","metricType":"ProvisionedConcurrencyUtilization","metricTarget":0.6,"minCapacity":1,"maxCapacity":3}]'
s provision get --qualifier test
s provision list
s provision remove --qualifier test -y
s provision list
s provision put --qualifier test --target 2 

s remove -y


Write-Host "test layer ..."
$layer_name = "pyyaml-layer-$($env:OS)-$($env:PROCESSOR_ARCHITECTURE)-$($env:RANDSTR)"
s layer list 
s layer list --prefix python
s layer info --layer-name Python39-Gradio --version-id 1
s layer download --layer-name Python39-Gradio --version-id 1
s layer publish --layer-name $layer_name --code ./pyyaml-layer.zip --compatible-runtime "python3.9,python3.10,custom,custom.debian10"
s layer list --prefix $layer_name
s layer list --prefix $layer_name --table
s layer versions --layer-name $layer_name
s layer remove -y --layer-name $layer_name