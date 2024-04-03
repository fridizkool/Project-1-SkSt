package com.manage.managementservice.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="WAREHOUSES")
public class Warehouse
{
    @Id
    @Column(name="ID", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="NAME")
    private String name;

    @ManyToOne
    @JoinColumn(name="COMPANY_ID")
    private Company company;

    @Column(name="LOCATION")
    private String location;

    @ManyToOne
    @JoinColumn(name="ITEM_ID")
    private Item item;

    @Column(name="HOLDING")
    private int holding;

    @Column(name="CAPACITY")
    private int capacity;

    public Warehouse() {
    }

    public Warehouse(String name, Company company, String location, Item item, int holding, int capacity) {
        this.name = name;
        this.company = company;
        this.location = location;
        this.item = item;
        this.holding = holding;
        this.capacity = capacity;
    }

    public Warehouse(int id, String name, Company company, String location, Item item, int holding, int capacity) {
        this.id = id;
        this.name = name;
        this.company = company;
        this.location = location;
        this.item = item;
        this.holding = holding;
        this.capacity = capacity;
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

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public int getHolding() {
        return holding;
    }

    public void setHolding(int holding) {
        this.holding = holding;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + id;
        result = prime * result + ((name == null) ? 0 : name.hashCode());
        result = prime * result + ((company == null) ? 0 : company.hashCode());
        result = prime * result + ((location == null) ? 0 : location.hashCode());
        result = prime * result + ((item == null) ? 0 : item.hashCode());
        result = prime * result + holding;
        result = prime * result + capacity;
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
        Warehouse other = (Warehouse) obj;
        if (id != other.id)
            return false;
        if (name == null) {
            if (other.name != null)
                return false;
        } else if (!name.equals(other.name))
            return false;
        if (company == null) {
            if (other.company != null)
                return false;
        } else if (!company.equals(other.company))
            return false;
        if (location == null) {
            if (other.location != null)
                return false;
        } else if (!location.equals(other.location))
            return false;
        if (item == null) {
            if (other.item != null)
                return false;
        } else if (!item.equals(other.item))
            return false;
        if (holding != other.holding)
            return false;
        if (capacity != other.capacity)
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Warehouse [id=" + id + ", name=" + name + ", company=" + company.getId() + ", location=" + location + ", item="
                + item.getId() + ", holding=" + holding + ", capacity=" + capacity + "]";
    }

    
}
