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

import com.manage.managementservice.models.Company;
import com.manage.managementservice.models.Warehouse;
import com.manage.managementservice.services.CompanyService;
import com.manage.managementservice.services.WarehouseService;

@RestController
@RequestMapping("/companies")
@CrossOrigin("*")
public class CompanyController
{
    @Autowired
    CompanyService companyService;
    
    @Autowired
    WarehouseService warehouseService;

    @GetMapping
    public ResponseEntity<List<Company>> findAllCompanies(@RequestParam(required = false) String id)    //allows for retrieving company singular or any
    {
        int companyid = -1;
        if(id == null)
            return ResponseEntity.ok(companyService.findAll());
        try
        {
            companyid = Integer.parseInt(id);
        } catch(NumberFormatException e) {
            companyid = -1;
        }
        List<Company> company = companyService.findAllById(companyid);
        if(company == null)
            return ResponseEntity.noContent().build();
        return ResponseEntity.ok(company);
    }

    @PostMapping("/company")
    public ResponseEntity<Company> createCompany(@RequestBody Company company)
    {
        return new ResponseEntity<>(companyService.createCompany(company), HttpStatus.CREATED);
    }

    @PutMapping("/company/update")
    public ResponseEntity<Company> updateCompany(@RequestBody Company company, int id)
    {
        return new ResponseEntity<>(companyService.updateCompany(company, id), HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteCompanyById(@RequestParam int id)
    {
        Company company = companyService.findById(id);
        if(company == null)
            return ResponseEntity.notFound().build();
        List<Warehouse> warehouses = warehouseService.findAllByCompanyId(id);
        if(warehouses != null)
            return new ResponseEntity<>("Other tables are still dependant on this company", HttpStatus.CONFLICT);
        companyService.deleteCompanyById(id);
        return new ResponseEntity<>("Deleted " + company, HttpStatus.OK);
    }
}
