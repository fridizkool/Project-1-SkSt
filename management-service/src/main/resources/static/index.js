const URL = "http://localhost:8080"

let allWarehouses = [];

document.addEventListener("DOMContentLoaded", () => {
    let xhr = new XMLHttpRequest();
})


function addWarehouse()
{

}

function addWarehouseToTable(warehouse)
{

}

function editWarehouse()
{

}

function deleteWarehouse()
{

}

async function doPostWarehouse(newWarehouse)
{
    let returned = await fetch(URL + '/warehouses/warehouse', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        }, 
        body : JSON.stringify(newWarehouse)
    });

    let warehouse = await returned.json();

    addWarehouseToTable(warehouse);

    document.getElementById('new-warehouse-form').reset();
}