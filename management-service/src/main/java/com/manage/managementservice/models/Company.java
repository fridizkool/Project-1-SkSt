package com.manage.managementservice.models;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="COMPANY")
public class Company {
    @Id
    @Column(name="id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="name")
    private String name;
    
    @OneToMany(targetEntity = Warehouse.class, mappedBy = "company")
    @JsonBackReference
    private Set<Warehouse> warehouses;


    public Company() {
    }

    public Company(String name) {
        this.name = name;
    }

    public Company(int id, String name, Set<Warehouse> warehouses) {
        this.id = id;
        this.name = name;
        this.warehouses = warehouses;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Warehouse> getWarehouses() {
        return warehouses;
    }

    public void setWarehouses(Set<Warehouse> warehouses) {
        this.warehouses = warehouses;
    }
    

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + id;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((warehouses == null) ? 0 : warehouses.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Company other = (Company) obj;
        if (id != other.id)
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (warehouses == null) {
            if (other.warehouses != null)
                return false;
        } else if (!warehouses.equals(other.warehouses))
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Company [id=" + id + ", name=" + name + "]";
    }
    
}
