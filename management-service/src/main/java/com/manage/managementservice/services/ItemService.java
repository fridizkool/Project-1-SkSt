package com.manage.managementservice.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.manage.managementservice.models.Item;
import com.manage.managementservice.repositories.ItemRepository;

@Service
public class ItemService {
    @Autowired
    ItemRepository itemRepository;

    public Item createItem(Item item)
    {
        Optional<Item> newitem = itemRepository.findByName(item.getName()); //Doesnt overwrite an existing item
        if(newitem.isPresent())
            return newitem.get();
        return itemRepository.save(item);
    }

    public Item updateItem(Item item, int id)
    {
        item.setId(id);
        return itemRepository.save(item);
    }

    public List<Item> findAllItems()
    {
        return itemRepository.findAll();
    }

    public Item findById(int id)
    {
        Optional<Item> item = itemRepository.findById(id);
        if(item.isPresent())
                return item.get();
        return null;
    }

    public List<Item> findAllById(int id)
    {
        Optional<List<Item>> item = itemRepository.findAllById(id);
        if(item.isPresent())
            if(item.get().size() > 0)
                return item.get();
        return null;
    }

    public void deleteItemById(int id)
    {
        itemRepository.deleteById(id);
    }
}
