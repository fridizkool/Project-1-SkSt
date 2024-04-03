package com.manage.managementservice.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.manage.managementservice.models.Item;
import com.manage.managementservice.models.Warehouse;
import com.manage.managementservice.services.ItemService;
import com.manage.managementservice.services.WarehouseService;

@RestController
@RequestMapping("/items")
@CrossOrigin("*")
public class ItemController
{
    @Autowired
    ItemService itemService;

    @Autowired
    WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<List<Item>> findAllItems(@RequestParam(required = false) String id)
    {
        int itemid = -1;
        if(id == null)
            return ResponseEntity.ok(itemService.findAllItems());
        try
        {
            itemid = Integer.parseInt(id);
        } catch(NumberFormatException e) {
            itemid = -1;
        }
        List<Item> items = itemService.findAllById(itemid);
        if(items == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(items);
    }

    @PostMapping("/item")
    public ResponseEntity<Item> createItem(@RequestBody Item item)
    {
        return new ResponseEntity<>(itemService.createItem(item), HttpStatus.CREATED);
    }

    @PutMapping("/item/update")
    public ResponseEntity<Item> createItem(@RequestBody Item item, @RequestParam int id)
    {
        return new ResponseEntity<>(itemService.updateItem(item, id), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteItemById(@RequestParam int id)
    {
        Item item = itemService.findById(id);
        if(item == null)
            return ResponseEntity.notFound().build();
        List<Warehouse> warehouses = warehouseService.findAllByItemId(id);
        if(warehouses != null)
            return new ResponseEntity<>("Other tables are still dependant on this item", HttpStatus.CONFLICT);
        itemService.deleteItemById(id);
        return new ResponseEntity<>("Deleted " + item, HttpStatus.OK);
    }
}
