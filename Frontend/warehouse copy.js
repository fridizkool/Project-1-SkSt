const URL = "http://localhost:8080/warehouses"

let allWarehouses = [];

document.addEventListener("DOMContentLoaded", () => {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if(xhr.readyState === 4)
        {
            let warehouses = JSON.parse(xhr.responseText);

            warehouses.forEach(element => {
                addWarehouseToTable(element);
            });
        }
    }

    xhr.open("GET", URL);

    xhr.send();
});

document.getElementById("new-warehouse").addEventListener('submit', (event) => {
    event.preventDefault();

    let input = new FormData(document.getElementById("new-warehouse"));
});


function addWarehouse()
{

}

function addWarehouseToTable(warehouse)
{
    console.log(warehouse);
    let row = document.createElement('div');
    let id = document.createElement('div');
    id.className = "col";
    let name = document.createElement('div');
    name.className = "col";
    let company = document.createElement('div');
    company.className = "col";
    let location = document.createElement('div');
    location.className = "col";
    let item = document.createElement('div');
    item.className = "col";
    let holding = document.createElement('div');
    holding.className = "col";
    let collapse = document.createElement('div');
    let info = document.createElement('div');

    id.innerText = warehouse.id;
    name.innerText = warehouse.name;
    company.innerText = warehouse.company.name;
    location.innerText = warehouse.location;
    item.innerText = warehouse.item.name;
    holding.innerText = warehouse.holding + "/" + warehouse.capacity;

    //init collapsable
    row.setAttribute('id', "row" + warehouse.id);
    row.setAttribute("class", "row");
    row.setAttribute("role", "button");
    row.setAttribute("data-bs-toggle", "collapse");
    row.setAttribute("href", "#collapse" + warehouse.id);
    row.setAttribute("aria-expand", "false");
    row.setAttribute("aria-controls", "collapse" + warehouse.id);
    
    collapse.setAttribute("id", "collapse" + warehouse.id);
    collapse.setAttribute("class", "col collapse");

    info.innerText = "gabba gabba" + warehouse.company;


    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(company);
    row.appendChild(location);
    row.appendChild(item);
    row.appendChild(holding);

    console.log(row);

    collapse.appendChild(info);

    document.getElementById('warehouse-table-body').appendChild(row);
    document.getElementById('warehouse-table-body').appendChild(collapse);

    allWarehouses.push(warehouse);
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

