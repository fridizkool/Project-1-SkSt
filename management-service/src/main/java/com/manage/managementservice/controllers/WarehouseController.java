package com.manage.managementservice.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.manage.managementservice.models.Warehouse;
import com.manage.managementservice.services.WarehouseService;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/warehouses")
@CrossOrigin("*")
public class WarehouseController {
    @Autowired
    WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<List<Warehouse>> findWarehouses(@RequestParam(required = false) String id)
    {
        int warehouseid = -1;
        if(id == null)
            return ResponseEntity.ok(warehouseService.findAllWarehouses());
        try
        {
            warehouseid = Integer.parseInt(id);
        } catch(NumberFormatException e) {
            warehouseid = -1;
        }
        List<Warehouse> warehouses = warehouseService.findAllById(warehouseid);
        if(warehouses == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(warehouses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<Warehouse>> findByCompanyId(@PathVariable int id) {
        List<Warehouse> warehouses = warehouseService.findAllByCompanyId(id);
        return new ResponseEntity<List<Warehouse>>(warehouses, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Warehouse>> findMethodName(@RequestParam String location) {
        List<Warehouse> warehouses = warehouseService.findAllByLocation(location);
        return new ResponseEntity<List<Warehouse>>(warehouses, HttpStatus.OK);
    }
    
    @PostMapping("/warehouse")
    public ResponseEntity<Warehouse> createWarehouse(@RequestBody Warehouse warehouse)
    {
        Warehouse newWarehouse = warehouseService.createWarehouse(warehouse);
        return new ResponseEntity<>(newWarehouse, HttpStatus.CREATED);
    }

    @PutMapping(value="/warehouse/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Warehouse> updateWarehouse(@RequestBody Warehouse warehouse, @RequestParam int id)
    {
        Warehouse newWarehouse = warehouseService.updateWarehouse(warehouse, id);
        return new ResponseEntity<>(newWarehouse, HttpStatus.ACCEPTED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Warehouse> deleteWarehouseById(@RequestParam int id)
    {
        Warehouse warehouse = warehouseService.findById(id);
        if(warehouse == null)
            return ResponseEntity.notFound().build();
        warehouseService.deleteWarehouseById(id);
        return new ResponseEntity<>(warehouse, HttpStatus.OK);
    }
}
