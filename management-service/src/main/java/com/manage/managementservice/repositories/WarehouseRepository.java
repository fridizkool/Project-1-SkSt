package com.manage.managementservice.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.manage.managementservice.models.Company;
import com.manage.managementservice.models.Item;
import com.manage.managementservice.models.Warehouse;

import jakarta.transaction.Transactional;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Integer> {
    @SuppressWarnings({ "unchecked", "null" })
    public Warehouse save(Warehouse warehouse);

    public Optional<List<Warehouse>> findAllById(int id);

    public Optional<List<Warehouse>> findAllByLocation(String location);

    public Optional<List<Warehouse>> findAllByCompany(Company company);

    public Optional<List<Warehouse>> findAllByItem(Item item);

    public Optional<List<Warehouse>> findAllByCompanyAndLocation(Company company, String location);

    public Optional<Warehouse> findByNameAndCompanyAndItemAndLocation(String name, Company company, Item item, String location);

    @Query("update Warehouse w set w.holding = ?1 where w.id = ?2")
    @Modifying
    @Transactional
    public int updateHolding(int holding, int id);
}
