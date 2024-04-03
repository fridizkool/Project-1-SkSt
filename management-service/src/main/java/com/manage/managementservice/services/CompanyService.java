package com.manage.managementservice.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.manage.managementservice.models.Company;
import com.manage.managementservice.repositories.CompanyRepository;

@Service
public class CompanyService {
    @Autowired
    CompanyRepository companyRepository;

    public Company findById(int id)
    {
        Optional<Company> company = companyRepository.findById(id);
        if(company.isPresent())
            return company.get();
        return null;
    }

    public List<Company> findAllById(int id)
    {
        Optional<List<Company>> company = companyRepository.findAllById(id);
        if(company.isPresent())
            if(company.get().size() > 0)
                return company.get();
        return null;
    }

    public List<Company> findAll()
    {
        return companyRepository.findAll();
    }

    public Company createCompany(Company company)
    {
        Optional<Company> newCompany = companyRepository.findByName(company.getName());
        if(newCompany.isPresent())
            return newCompany.get();
        return companyRepository.save(company);
    }

    public Company updateCompany(Company company, int id)
    {
        company.setId(id);
        return companyRepository.save(company);
    }

    public void deleteCompanyById(int id)
    {
        companyRepository.deleteById(id);
    }
}
