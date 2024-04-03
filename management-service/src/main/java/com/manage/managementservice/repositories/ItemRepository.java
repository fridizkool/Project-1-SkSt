package com.manage.managementservice.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.manage.managementservice.models.Item;

public interface ItemRepository extends JpaRepository<Item, Integer> {
    @SuppressWarnings({ "null", "unchecked" })
    public Item save(Item item);

    public Optional<List<Item>> findAllById(int id);

    public Optional<Item> findByName(String name);
}
