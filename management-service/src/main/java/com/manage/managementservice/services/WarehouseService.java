package com.manage.managementservice.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.manage.managementservice.models.Company;
import com.manage.managementservice.models.Item;
import com.manage.managementservice.models.Warehouse;
import com.manage.managementservice.repositories.WarehouseRepository;

@Service
public class WarehouseService {
    @Autowired
    WarehouseRepository warehouseRepository;
    @Autowired
    CompanyService companyService;
    @Autowired
    ItemService itemService;

    public List<Warehouse> findAllWarehouses()
    {
        return warehouseRepository.findAll();
    }

    public Warehouse findById(int id)
    {
        Optional<Warehouse> warehouse = warehouseRepository.findById(id);
        if(warehouse.isPresent())
            return warehouse.get();
        return null;
    }

    public List<Warehouse> findAllById(int id)
    {
        Optional<List<Warehouse>> warehouse = warehouseRepository.findAllById(id);
        if(warehouse.isPresent())
            if(warehouse.get().size() > 0)
                return warehouse.get();
        return null;
    }

    public List<Warehouse> findAllByCompanyId(int id)
    {
        Company company = companyService.findById(id);
        if(company == null)
            return null;
        Optional<List<Warehouse>> warehouses = warehouseRepository.findAllByCompany(company);
        if(warehouses.isPresent())
            if(warehouses.get().size() > 0)
                return warehouses.get();
        return null;
    }

    public List<Warehouse> findAllByLocation(String location)
    {
        Optional<List<Warehouse>> warehouses = warehouseRepository.findAllByLocation(location);
        if(warehouses.isPresent())
            if(warehouses.get().size() > 0)
                return warehouses.get();
        return null;
    }

    public List<Warehouse> findAllByItemId(int id)
    {
        Item item = itemService.findById(id);
        Optional<List<Warehouse>> warehouses = warehouseRepository.findAllByItem(item);
        if(warehouses.isPresent())
            if(warehouses.get().size() > 0)
                return warehouses.get();
        return null;
    }

    public Warehouse createWarehouse(Warehouse warehouse)
    {
        Company company = companyService.createCompany(warehouse.getCompany()); //Doesnt overwrite an existing item
        Item item = itemService.createItem(warehouse.getItem());
        warehouse.setCompany(company);
        warehouse.setItem(item);
        Optional<Warehouse> newWarehouse = exists(warehouse);
        if(newWarehouse.isPresent())
            return newWarehouse.get();
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Warehouse warehouse, int id)
    {
        Company company = companyService.createCompany(warehouse.getCompany());
        Item item = itemService.createItem(warehouse.getItem());
        warehouse.setCompany(company);
        warehouse.setItem(item);
        warehouse.setId(id);
        return warehouseRepository.save(warehouse);
    }

    public Optional<Warehouse> exists(Warehouse warehouse)
    {
        return  warehouseRepository.findByNameAndCompanyAndItemAndLocation(warehouse.getName(), warehouse.getCompany(), warehouse.getItem(), warehouse.getLocation());
    }

    public void deleteWarehouseById(int id)
    {
        warehouseRepository.deleteById(id);
    }
}
