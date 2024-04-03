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
@Table(name="ADMINS")
public class Admin {
    @Id
    @Column(name="id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="COMPANY_ID")
    private Company company;

    @Column
    private String username;
    
    @Column(name="pass")
    private String password;

    @Column
    private int authority;

    public Admin() {
    }

    public Admin(int id, Company company, String username, String password, int authority) {
        this.id = id;
        this.company = company;
        this.username = username;
        this.password = password;
        this.authority = authority;
    }

    public Admin(Company company, String username, String password, int authority) {
        this.company = company;
        this.username = username;
        this.password = password;
        this.authority = authority;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getAuthority() {
        return authority;
    }

    public void setAuthority(int authority) {
        this.authority = authority;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + id;
        result = prime * result + ((company == null) ? 0 : company.hashCode());
        result = prime * result + ((username == null) ? 0 : username.hashCode());
        result = prime * result + ((password == null) ? 0 : password.hashCode());
        result = prime * result + authority;
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
        Admin other = (Admin) obj;
        if (id != other.id)
            return false;
        if (company == null) {
            if (other.company != null)
                return false;
        } else if (!company.equals(other.company))
            return false;
        if (username == null) {
            if (other.username != null)
                return false;
        } else if (!username.equals(other.username))
            return false;
        if (password == null) {
            if (other.password != null)
                return false;
        } else if (!password.equals(other.password))
            return false;
        if (authority != other.authority)
            return false;
        return true;
    }

    @Override
    public String toString() {
        return "Admin [id=" + id + ", company=" + company + ", username=" + username + ", password=" + password
                + ", authority=" + authority + "]";
    }
}
