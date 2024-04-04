const URL = "http://localhost:8080"

let allWarehouses = [];

let allItems = [];

let allCompanies = [];

let auth = 2;   //initially in admin view

const br = (() => document.createElement('br'));;   //create breaks easily

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);  //math

let login = -1;

document.addEventListener("DOMContentLoaded", () => {   //on load

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

    fetch(URL + '/items', { //create a datalist for items
        method: 'GET'
    }).then((data) => {
        return data.json();
    }).then((itemsJson) => {
        itemsJson.forEach(element => {
            allItems.push(element);
            addItemToTable(element);
        })
        document.body.appendChild(makeOptionsName(allItems, 'itemlist'));
    });

    fetch(URL + '/companies', {     //create a datalist for companies
        method: 'GET'
    }).then((data) => {
        return data.json();
    }).then((companiesJson) => {
        companiesJson.forEach(element => {

            allCompanies.push(element);
            addCompanyToTable(element);
        })
        document.body.appendChild(makeOptionsName(allCompanies, 'companylist'));
    })
        .then(() => {
            setupLogin();   //make the auth bar
        });
});

document.getElementById("new-warehouse-form").addEventListener('submit', (event) => {
    event.preventDefault();
    let input = new FormData(document.getElementById("new-warehouse-form"));

    const capacityFixed = clamp(Number(input.get(`new-warehouse-capacity`)), 0, Number.MAX_VALUE);

    let newWarehouse = {
        name: input.get(`new-warehouse-name`),
        company: {
            name: document.getElementById(`new-warehouse-company`).value
        },
        location: input.get(`new-warehouse-location`),
        item: {
            name: input.get(`new-warehouse-item`)
        },
        holding: Number(clamp(Number(input.get(`new-warehouse-holding`)), 0, capacityFixed)),
        capacity: Number(capacityFixed)
    }

    let warehouse = doPostWarehouse(newWarehouse);

    document.getElementById("toast-title").innerText = "Warehouse Created";
    document.getElementById("toast-info").innerText = `Warehouse ${warehouse.name} created!`;
    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
    toastResponse.show();
    updateCompanyInTable(warehouse.company);
    updateItemInTable(warehouse.item);
});

function setupLogin() { //create the login dropdown
    let loginPage = document.getElementById("login");
    loginPage.innerHTML = '';
    let admin = document.createElement("a");
    admin.setAttribute("class", "dropdown-item");
    admin.setAttribute("href", "#");
    admin.innerText = "Admin";
    admin.addEventListener("click", (event) => {
        fetch(URL + '/warehouses', {
            method: 'GET'
        }).then((data) => {
            return data.json();
        }).then((warehouses) => {
            allWarehouses = [];
            document.getElementById('warehouse-table-body').innerHTML = '';
            document.getElementById("item-tab").disabled = false;
            document.getElementById("new-warehouse-company").disabled = false;
            document.getElementById("new-warehouse-company").value = '';
            auth = 2;
            warehouses.forEach(element => {
                addWarehouseToTable(element);
                allWarehouses.push(element);
            });
        });
    });
    const listItem = document.createElement('li');
    listItem.appendChild(admin);
    loginPage.appendChild(listItem);

    allCompanies.forEach((element) => {
        let child = document.createElement("a");
        child.innerText = element.name;
        child.addEventListener("click", (event) => {
            login = element.id;
            auth = 0;
            document.getElementById("item-tab").disabled = true;
            document.getElementById("new-warehouse-company").disabled = true;
            document.getElementById("new-warehouse-company").value = element.name;
            getWarehousesByCompany(login);
        });
        child.setAttribute("class", "dropdown-item");
        child.setAttribute("href", "#");
        const listItem = document.createElement('li');
        listItem.appendChild(child);
        loginPage.appendChild(listItem);
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
    holding.innerText = (warehouse.holding * warehouse.item.volume) + "/" + (warehouse.capacity * warehouse.item.volume);

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
    // row.appendChild(capacity);

    document.getElementById('warehouse-table-body').appendChild(row);
    document.getElementById('warehouse-table-body').appendChild(collapse);

    allWarehouses.push(warehouse);
}

function makeCollapseWarehouse(warehouse) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let wrapper = document.createElement('div');
    let form = document.createElement('form');

    let update = document.createElement('button');
    let del = document.createElement('button');

    let nameIn = document.createElement('input');
    let companyIn = document.createElement('input');
    let locationIn = document.createElement('input');
    let itemIn = document.createElement('input');
    let holdingIn = document.createElement('input');
    let capacityIn = document.createElement('input');

    let nameLabel = document.createElement("label");
    let companyLabel = document.createElement("label");
    let locationLabel = document.createElement("label");
    let itemLabel = document.createElement("label");
    let holdingLabel = document.createElement("label");
    let capacityLabel = document.createElement("label");

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
    nameLabel.setAttribute('for', `update-name-${warehouse.id}`);
    nameLabel.setAttribute('class', `form-label`);
    nameLabel.innerText = "Warehouse name";

    companyIn.setAttribute('type', 'text');
    companyIn.setAttribute('list', 'companylist')
    if (auth < 2)
        companyIn.disabled = true;
    companyIn.setAttribute('value', warehouse.company.name);
    companyIn = giveNameId(companyIn, `update-company-${warehouse.id}`);
    companyIn.setAttribute('class', 'form-control');
    companyLabel.setAttribute('for', `update-company-${warehouse.id}`);
    companyLabel.setAttribute('class', `form-label`);
    companyLabel.innerText = 'Company name';

    locationIn.setAttribute('type', 'text');
    locationIn.setAttribute('value', warehouse.location);
    locationIn = giveNameId(locationIn, `update-location-${warehouse.id}`);
    locationIn.setAttribute('class', 'form-control');
    locationLabel.setAttribute('for', `update-location-${warehouse.id}`);
    locationLabel.setAttribute('class', `form-label`);
    locationLabel.innerText = 'Location';

    itemIn.setAttribute('type', 'text');
    itemIn.setAttribute('list', 'itemlist');
    itemIn.setAttribute('value', warehouse.item.name);
    itemIn = giveNameId(itemIn, `update-item-${warehouse.id}`);
    itemIn.setAttribute('class', 'form-control');
    itemLabel.setAttribute('for', `update-item-${warehouse.id}`);
    itemLabel.setAttribute('class', `form-label`);
    itemLabel.innerText = 'Item name';

    holdingIn.setAttribute('type', 'number');
    holdingIn.setAttribute('min', '0');
    holdingIn.setAttribute('max', warehouse.capacity);
    holdingIn.setAttribute('value', warehouse.holding);
    holdingIn = giveNameId(holdingIn, `update-holding-${warehouse.id}`);
    holdingIn.setAttribute('class', 'form-control');
    holdingLabel.setAttribute('for', `update-holding-${warehouse.id}`);
    holdingLabel.setAttribute('class', `form-label`);
    holdingLabel.innerText = 'Item amount';

    capacityIn.setAttribute('type', 'number');
    capacityIn.setAttribute('value', warehouse.capacity);
    capacityIn = giveNameId(capacityIn, `update-capacity-${warehouse.id}`);
    capacityIn.setAttribute('class', 'form-control');
    capacityLabel.setAttribute('for', `update-capacity-${warehouse.id}`);
    capacityLabel.setAttribute('class', `form-label`);
    capacityLabel.innerText = 'Maximum item capacity';

    form.appendChild(nameLabel);
    form.appendChild(nameIn);
    // form.appendChild(br());
    form.appendChild(companyLabel);
    form.appendChild(companyIn);
    // form.appendChild(br());
    form.appendChild(locationLabel);
    form.appendChild(locationIn);
    // form.appendChild(br());
    form.appendChild(itemLabel);
    form.appendChild(itemIn);
    // form.appendChild(br());
    form.appendChild(holdingLabel);
    form.appendChild(holdingIn);
    // form.appendChild(br());
    form.appendChild(capacityLabel);
    form.appendChild(capacityIn);
    // form.appendChild(br());
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

    return warehouse;
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


//ITEMS

function addItemToTable(item) {
    let row = document.createElement('tr');
    let id = document.createElement('th');
    let name = document.createElement('td');
    let volume = document.createElement('td');

    let collapse = makeCollapseItem(item);

    id.innerText = item.id;
    name.innerText = item.name;
    volume.innerText = item.volume;

    row.setAttribute('id', "item-row" + item.id);
    row.setAttribute("role", "button");
    row.setAttribute("data-bs-toggle", "collapse");
    row.setAttribute("href", "#item-collapse" + item.id);
    row.setAttribute("aria-expand", "false");
    row.setAttribute("aria-controls", "item-collapse" + item.id);

    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(volume);

    document.getElementById('item-table-body').appendChild(row);
    document.getElementById('item-table-body').appendChild(collapse);

    allItems.push(item);
}

function makeCollapseItem(item) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let wrapper = document.createElement('div');
    let form = document.createElement('form');
    let update = document.createElement('button');
    let del = document.createElement('button');
    let nameIn = document.createElement('input');
    let volumeIn = document.createElement('input');

    wrapper.setAttribute("id", "item-collapse" + item.id);
    wrapper.setAttribute("class", "collapse");

    update.setAttribute("type", 'submit');
    update.setAttribute("class", "btn btn-success")
    update.innerText = `➥`;
    del.setAttribute("type", 'button');
    del.setAttribute("class", "btn btn-danger")
    del.innerText = `╳`;

    del.addEventListener("click", (event) => {
        event.preventDefault();

        fetch(`${URL}/items/delete?id=${item.id}`, {
            method: 'DELETE'
        })
            .then((data) => {
                if (data.status === 200) {
                    let info = document.getElementById("item-row" + item.id);
                    let edit = document.getElementById("item-collapse" + item.id);
                    info.remove();
                    edit.remove();

                    document.getElementById("toast-title").innerText = `Item Deleted`;
                    document.getElementById("toast-info").innerText = `${item.name} Deleted!`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
                else {
                    document.getElementById("toast-title").innerText = "Error deleting";
                    document.getElementById("toast-info").innerText = `Warehouses depend on ${item.name}`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
            })
    });

    nameIn.setAttribute('type', 'text');
    nameIn.setAttribute('value', item.name);
    nameIn = giveNameId(nameIn, `update-item-name-${item.id}`);
    nameIn.setAttribute('class', 'form-control');

    volumeIn.setAttribute('type', 'number');
    volumeIn.setAttribute('value', item.volume);
    volumeIn = giveNameId(volumeIn, `update-item-volume-${item.id}`);
    volumeIn.setAttribute('class', 'form-control');

    form.appendChild(nameIn);
    form.appendChild(br());
    form.appendChild(volumeIn);
    form.appendChild(br());
    form.appendChild(update);
    form.appendChild(del);

    form.setAttribute('id', `update-item-form${item.id}`);
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let input = new FormData(form);

        const id = item.id;
        const volumeFixed = clamp(Number(input.get(`update-item-volume-${id}`)), 0, Number.MAX_VALUE);

        let newItem = {
            id: Number(id),
            name: input.get(`update-item-name-${id}`),
            volume: Number(volumeFixed)
        }

        fetch(`${URL}/items/item/update?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(newItem)
        })
            .then((data) => {
                return data.json();
            })
            .then((itemJson) => {
                updateItemInTable(itemJson);
            })
            .catch(error => console.error(error));
    });

    wrapper.appendChild(form);
    tr.setAttribute('id', 'collapsed-item-row' + item.id);
    td.setAttribute('colspan', 7);
    td.appendChild(wrapper);
    tr.append(td);

    return tr;
}

function updateItemInTable(item) {
    if (allItems.find(element => element.name === item.name) === undefined) {
        allItems.push(item.item);
        let datalist = document.getElementById('itemlist');
        const child = document.createElement('option');
        child.setAttribute('value', item.name);
        datalist.appendChild(child);

        document.getElementById("toast-title").innerText = "Item Created";
        document.getElementById("toast-info").innerText = `Item ${item.name} created!`;
        toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
        toastResponse.show();
    }

    let row = document.getElementById(`item-row${item.id}`);

    let id = document.createElement('th');
    let name = document.createElement('td');
    let volume = document.createElement('td');

    id.innerText = item.id;
    name.innerText = item.name;
    volume.innerText = item.volume;

    row.innerHTML = '';
    row.appendChild(id);
    row.appendChild(name);
    row.appendChild(volume);

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
}


//Companies

function addCompanyToTable(company) {
    let row = document.createElement('tr');
    let id = document.createElement('th');
    let name = document.createElement('td');

    let collapse = makeCollapseComany(company);

    id.innerText = company.id;
    name.innerText = company.name;

    row.setAttribute('id', "company-row" + company.id);
    row.setAttribute("role", "button");
    row.setAttribute("data-bs-toggle", "collapse");
    row.setAttribute("href", "#company-collapse" + company.id);
    row.setAttribute("aria-expand", "false");
    row.setAttribute("aria-controls", "company-collapse" + company.id);

    row.appendChild(id);
    row.appendChild(name);

    document.getElementById('company-table-body').appendChild(row);
    document.getElementById('company-table-body').appendChild(collapse);

    allItems.push(company);
}

function makeCollapseComany(company) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let wrapper = document.createElement('div');
    let form = document.createElement('form');
    let update = document.createElement('button');
    let del = document.createElement('button');
    let nameIn = document.createElement('input');

    wrapper.setAttribute("id", "company-collapse" + company.id);
    wrapper.setAttribute("class", "collapse");

    update.setAttribute("type", 'submit');
    update.setAttribute("class", "btn btn-success")
    update.innerText = `➥`;
    del.setAttribute("type", 'button');
    del.setAttribute("class", "btn btn-danger")
    del.innerText = `╳`;

    del.addEventListener("click", (event) => {
        event.preventDefault();

        fetch(`${URL}/companies/delete?id=${company.id}`, {
            method: 'DELETE'
        })
            .then((data) => {
                if (data.status === 200) {
                    let info = document.getElementById("company-row" + company.id);
                    let edit = document.getElementById("company-collapse" + company.id);
                    info.remove();
                    edit.remove();

                    document.getElementById("toast-title").innerText = `Item Deleted`;
                    document.getElementById("toast-info").innerText = `${company.name} Deleted!`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
                else {
                    document.getElementById("toast-title").innerText = "Error deleting";
                    document.getElementById("toast-info").innerText = `Warehouses depend on ${company.name}`;
                    toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
                    toastResponse.show();
                }
            })
    });

    nameIn.setAttribute('type', 'text');
    nameIn.setAttribute('value', company.name);
    nameIn = giveNameId(nameIn, `update-company-name-${company.id}`);
    nameIn.setAttribute('class', 'form-control');

    form.appendChild(nameIn);
    form.appendChild(br());
    form.appendChild(update);
    form.appendChild(del);

    form.setAttribute('id', `update-company-form${company.id}`);
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        let input = new FormData(form);

        const id = company.id;

        let newCompany = {
            id: Number(id),
            name: input.get(`update-company-name-${id}`),
        }

        fetch(`${URL}/companies/company/update?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(newCompany)
        })
            .then((data) => {
                return data.json();
            })
            .then((companyJson) => {
                updateCompanyInTable(companyJson);
            })
            .catch(error => console.error(error));
    });

    wrapper.appendChild(form);
    tr.setAttribute('id', 'collapsed-company-row' + company.id);
    td.setAttribute('colspan', 7);
    td.appendChild(wrapper);
    tr.append(td);

    return tr;
}

function updateCompanyInTable(company) {
    if (allCompanies.find(element => element.name === company.name) === undefined) {
        allCompanies.push(company);
        let datalist = document.getElementById('companylist');
        const child = document.createElement('option');
        child.setAttribute('value', company.name);
        datalist.appendChild(child);

        document.getElementById("toast-title").innerText = "Company Created";
        document.getElementById("toast-info").innerText = `Company ${company.name} created!`;
        toastResponse = bootstrap.Toast.getOrCreateInstance(document.getElementById('toast-response'));
        toastResponse.show();
    }

    let row = document.getElementById(`company-row${company.id}`);

    let id = document.createElement('th');
    let name = document.createElement('td');

    id.innerText = company.id;
    name.innerText = company.name;

    row.innerHTML = '';
    row.appendChild(id);
    row.appendChild(name);

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
    }).then(() => {
        fetch(URL + '/companies', {     //create a datalist for companies
            method: 'GET'
        }).then((data) => {
            return data.json();
        }).then((companiesJson) => {
            companiesJson.forEach(element => {
                allCompanies.push(element);
                addCompanyToTable(element);
            })
            document.body.appendChild(makeOptionsName(allCompanies, 'companylist'));
        })
            .then(() => {
                fetch(URL + '/companies', {     //create a datalist for companies
                    method: 'GET'
                }).then((data) => {
                    return data.json();
                }).then((companiesJson) => {
                    companiesJson.forEach(element => {
                        allCompanies.push(element);
                        addCompanyToTable(element);
                    })
                    document.body.appendChild(makeOptionsName(allCompanies, 'companylist'));
                })
                    .then(() => {
                        setupLogin();   //make the auth bar
                    });
            });
    });
}