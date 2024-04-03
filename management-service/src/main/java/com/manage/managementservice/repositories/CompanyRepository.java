package com.manage.managementservice.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.manage.managementservice.models.Company;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
    @SuppressWarnings({ "null", "unchecked" })
    public Company save(Company company);
    public Optional<List<Company>> findAllById(int id);

    public Optional<Company> findByName(String name);

}
