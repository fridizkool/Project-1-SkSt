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
@Table(name="ITEMS")
public class Item {
    @Id
    // @SequenceGenerator(name = "items_id_seq",
    //                     sequenceName = "items_id_seq",
    //                     allocationSize = 1)
    @Column(name="id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name="volume")
    private int volume;

    @Column(name="name")
    private String name;

    @OneToMany(targetEntity = Warehouse.class, mappedBy = "item")
    @JsonBackReference
    private Set<Warehouse> warehouses;

    public Item() {
    }

    public Item(int volume, String name) {
        this.volume = volume;
        this.name = name;
    }

    public Item(int volume, String name, Set<Warehouse> warehouses) {
        this.volume = volume;
        this.name = name;
        this.warehouses = warehouses;
    }

    public Item(int id, int volume, String name, Set<Warehouse> warehouses) {
        this.id = id;
        this.volume = volume;
        this.name = name;
        this.warehouses = warehouses;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getVolume() {
        return volume;
    }

    public void setVolume(int volume) {
        this.volume = volume;
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
        result = prime * result + volume;
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
        Item other = (Item) obj;
        if (id != other.id)
            return false;
        if (volume != other.volume)
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
        return "Item [id=" + id + ", volume=" + volume + ", name=" + name + "]";
    }

}
