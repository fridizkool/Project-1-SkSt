const URL = "http://localhost:8080"

let allWarehouses = [];

let allItems = [];

let allCompanies = [];

let auth = 2;

const br = (() => document.createElement('br'));

const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

let login = -1;

document.addEventListener("DOMContentLoaded", () => {

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            let warehouses = JSON.parse(xhr.responseText);

            warehouses.forEach(element => {
                addWarehouseToTable(element);
            });
        }
    }

    xhr.open("GET", URL + '/warehouses');

    xhr.send();

    fetch(URL + '/items', {
        method: 'GET'
    }).then((data) => {
        return data.json();
    }).then((itemsJson) => {
        itemsJson.forEach(element => {
            allItems.push(element);
        })
        document.body.appendChild(makeOptionsName(allItems, 'itemlist'));
    });

    fetch(URL + '/companies', {
        method: 'GET'
    }).then((data) => {
        return data.json();
    }).then((companiesJson) => {
        companiesJson.forEach(element => {
            allCompanies.push(element);
        })
        document.body.appendChild(makeOptionsName(allCompanies, 'companylist'));
    })
        .then(() => {
            setupLogin();
        });
});

document.getElementById("new-warehouse").addEventListener('submit', (event) => {
    event.preventDefault();

    let input = new FormData(document.getElementById("new-warehouse"));
});

function setupLogin() {
    let loginPage = document.getElementById("login");
    let select = document.createElement("li");
    select.setAttribute('id', "select-login");
    allCompanies.forEach((element) => {
        const child = document.createElement("a");
        child.innerText = element.name;
        child.addEventListener("click", (event) => {
            login = element.id;
            auth = 0;
            getWarehousesByCompany(login);
        });
        child.setAttribute("class", "dropdown-item");
        child.setAttribute("href", "#");
        const listItem = document.createElement('li');
        listItem.appendChild(child);
        select.appendChild(listItem);
    });
    loginPage.appendChild(select);
    let admin = document.getElementById("admin");
    admin.addEventListener("click", (event) => {
        fetch(URL + '/warehouses', {
            method: 'GET'
        }).then((data) => {
            return data.json();
        }).then((warehouses) => {
            allWarehouses = [];
            document.getElementById('warehouse-table-body').innerHTML = '';
            auth = 2;
            warehouses.forEach(element => {
                addWarehouseToTable(element);
                allWarehouses.push(element);
            });
        });
    });
}

function getWarehousesByCompany(id) //for company search
{
    fetch(URL + '/warehouses/' + id, {
        method: 'GET'
    }).then((data) => {
        return data.json();
    }).then((warehouses) => {
        allWarehouses = [];
        document.getElementById('warehouse-table-body').innerHTML = '';
        warehouses.forEach(element => {
            addWarehouseToTable(element);
            allWarehouses.push(element);
        });
    });
}

function addWarehouseToTable(warehouse) {
    console.log(warehouse);
    let row = document.createElement('tr');
    let id = document.createElement('th');
    let name = document.createElement('td');
    let company = document.createElement('td');
    let location = document.createElement('td');
    let item = document.createElement('td');
    let holding = document.createElement('td');
    let capacity = document.createElement('td');

    let collapse = makeCollapseWarehouse(warehouse);

    id.innerText = warehouse.id;
    name.innerText = warehouse.name;
    company.innerText = warehouse.company.name;
    location.innerText = warehouse.location;
    item.innerText = warehouse.item.name;
    holding.innerText = warehouse.holding;
    capacity.innerText = warehouse.capacity;

    //init collapsable
    row.setAttribute('id', "row" + warehouse.id);
    row.setAttribute("role", "button");
    row.setAttribute("data-bs-toggle", "collapse");
    row.setAttribute("href", "#collapse" + warehouse.id);
    row.setAttribute("aria-expand", "false");
    row.setAttribute("aria-controls", "collapse" + warehouse.id);

    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(company);
    row.appendChild(location);
    row.appendChild(item);
    row.appendChild(holding);
    row.appendChild(capacity);

    document.getElementById('warehouse-table-body').appendChild(row);
    document.getElementById('warehouse-table-body').appendChild(collapse);

    allWarehouses.push(warehouse);
}

function makeCollapseWarehouse(warehouse) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let wrapper = document.createElement('div');
    let form = document.createElement('form');

    // let buttons = document.createElement('td');
    let update = document.createElement('button');
    let del = document.createElement('button');

    // let name = document.createElement('td');
    let nameIn = document.createElement('input');

    // let company = document.createElement('td');
    let companyIn = document.createElement('input');

    // let location = document.createElement('td');
    let locationIn = document.createElement('input');

    // let item = document.createElement('td');
    let itemIn = document.createElement('input');

    // let holding = document.createElement('td');
    let holdingIn = document.createElement('input');

    // let capacity = document.createElement('td');
    let capacityIn = document.createElement('input');

    wrapper.setAttribute("id", "collapse" + warehouse.id);
    wrapper.setAttribute("class", "collapse");

    update.setAttribute("type", 'submit');
    update.setAttribute("class", "btn btn-success")
    update.innerText = `➥`;
    del.setAttribute("type", 'button');
    del.setAttribute("class", "btn btn-danger")
    del.innerText = `╳`;

    del.addEventListener("click", (event) => {
        event.preventDefault();

        fetch(`${URL}/warehouses/delete?id=${warehouse.id}`, {
            method: 'DELETE'
        })
            .then((data) => {
                if (data.status === 200) {
                    let info = document.getElementById("row" + warehouse.id);
                    let edit = document.getElementById("collapse" + warehouse.id);
                    info.remove();
                    edit.remove();

                    document.getElementById("toast-title").innerText = `Deleted`;
                    document.getElementById("toast-info").innerText = `${warehouse.name} Deleted!`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
                else {
                    document.getElementById("toast-title").innerText = "Error deleting";
                    document.getElementById("toast-info").innerText = `Does not exist!`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
            })
    });

    nameIn.setAttribute('type', 'text');
    nameIn.setAttribute('value', warehouse.name);
    nameIn = giveNameId(nameIn, `update-name-${warehouse.id}`);
    nameIn.setAttribute('class', 'form-control');
    // name.appendChild(nameIn);

    companyIn.setAttribute('type', 'text');
    companyIn.setAttribute('list', 'companylist')
    if (auth < 2)
        companyIn.disabled = true;
    companyIn.setAttribute('value', warehouse.company.name);
    companyIn = giveNameId(companyIn, `update-company-${warehouse.id}`);
    companyIn.setAttribute('class', 'form-control');
    // company.appendChild(companyIn);

    locationIn.setAttribute('type', 'text');
    locationIn.setAttribute('value', warehouse.location);
    locationIn = giveNameId(locationIn, `update-location-${warehouse.id}`);
    locationIn.setAttribute('class', 'form-control');
    // location.appendChild(locationIn);

    itemIn.setAttribute('type', 'text');
    itemIn.setAttribute('list', 'itemlist');
    itemIn.setAttribute('value', warehouse.item.name);
    itemIn = giveNameId(itemIn, `update-item-${warehouse.id}`);
    itemIn.setAttribute('class', 'form-control');
    // item.appendChild(itemIn);

    holdingIn.setAttribute('type', 'number');
    holdingIn.setAttribute('min', '0');
    holdingIn.setAttribute('max', warehouse.capacity);
    holdingIn.setAttribute('value', warehouse.holding);
    holdingIn = giveNameId(holdingIn, `update-holding-${warehouse.id}`);
    holdingIn.setAttribute('class', 'form-control');
    // holding.appendChild(holdingIn);

    capacityIn.setAttribute('type', 'number');
    capacityIn.setAttribute('value', warehouse.capacity);
    capacityIn = giveNameId(capacityIn, `update-capacity-${warehouse.id}`);
    capacityIn.setAttribute('class', 'form-control');
    // capacity.appendChild(capacityIn);

    form.appendChild(nameIn);
    form.appendChild(br());
    form.appendChild(companyIn);
    form.appendChild(br());
    form.appendChild(locationIn);
    form.appendChild(br());
    form.appendChild(itemIn);
    form.appendChild(br());
    form.appendChild(holdingIn);
    form.appendChild(br());
    form.appendChild(capacityIn);
    form.appendChild(br());
    form.appendChild(update);
    form.appendChild(del);

    form.setAttribute('id', `update-warehouse-form${warehouse.id}`);
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let input = new FormData(form);

        const id = warehouse.id;
        const capacityFixed = clamp(Number(input.get(`update-capacity-${id}`)), 0, Number.MAX_VALUE);

        let newWarehouse = {
            id: Number(id),
            name: input.get(`update-name-${id}`),
            company: {
                name: document.getElementById(`update-company-${id}`).value
            },
            location: input.get(`update-location-${id}`),
            item: {
                name: input.get(`update-item-${id}`)
            },
            holding: Number(clamp(Number(input.get(`update-holding-${id}`)), 0, capacityFixed)),
            capacity: Number(capacityFixed)
        }
        console.log(JSON.stringify(newWarehouse));
        fetch(`${URL}/warehouses/warehouse/update?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(newWarehouse)
        })
            .then((data) => {
                return data.json();
            })
            .then((warehouseJson) => {
                console.log(warehouseJson);
                updateWarehouseInTable(warehouseJson);
            })
            .catch(error => console.error(error));
    });

    wrapper.appendChild(form);
    tr.setAttribute('id', 'collapsedrow' + warehouse.id);
    td.setAttribute('colspan', 7);
    td.appendChild(wrapper);
    tr.append(td);

    return tr;
}

function makeOptionsName(arr, name) {
    let datalist = document.createElement('datalist');
    datalist.setAttribute('id', name);
    arr.forEach((element) => {
        const child = document.createElement('option');
        child.setAttribute('value', element.name);
        datalist.appendChild(child);
    });
    return datalist;
}

function giveNameId(element, name)  //shortcut to give inputs their name and ids (its annoying)
{
    element.setAttribute('id', name);
    element.setAttribute('name', name);
    return element;
}


function deleteWarehouse() {

}

async function doPostWarehouse(newWarehouse) {
    let returned = await fetch(URL + '/warehouses/warehouse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newWarehouse)
    });

    let warehouse = await returned.json();

    addWarehouseToTable(warehouse);

    document.getElementById('new-warehouse-form').reset();
}

function updateWarehouseInTable(warehouse) {
    if (allCompanies.find(element => element.name === warehouse.company.name) === undefined) {
        allCompanies.push(warehouse.company);
        let datalist = document.getElementById('companylist');
        const child = document.createElement('option');
        child.setAttribute('value', warehouse.company.name);
        datalist.appendChild(child);

        document.getElementById("toast-title").innerText = "Company Created";
        document.getElementById("toast-info").innerText = `Company ${warehouse.company.name} created!`;
        toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
        toastResponse.show();
    }
    if (allItems.find(element => element.name === warehouse.item.name) === undefined) {
        allItems.push(warehouse.item);
        let datalist = document.getElementById('itemlist');
        const child = document.createElement('option');
        child.setAttribute('value', warehouse.item.name);
        datalist.appendChild(child);

        document.getElementById("toast-title").innerText = "Item Created";
        document.getElementById("toast-info").innerText = `Item ${warehouse.item.name} created!`;
        toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
        toastResponse.show();
    }


    let row = document.getElementById(`row${warehouse.id}`);

    let id = document.createElement('th');
    let name = document.createElement('td');
    let company = document.createElement('td');
    let location = document.createElement('td');
    let item = document.createElement('td');
    let holding = document.createElement('td');
    let capacity = document.createElement('td');

    id.innerText = warehouse.id;
    name.innerText = warehouse.name;
    company.innerText = warehouse.company.name;
    location.innerText = warehouse.location;
    item.innerText = warehouse.item.name;
    holding.innerText = warehouse.holding;
    capacity.innerText = warehouse.capacity;

    row.innerHTML = '';
    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(company);
    row.appendChild(location);
    row.appendChild(item);
    row.appendChild(holding);
    row.appendChild(capacity);
}