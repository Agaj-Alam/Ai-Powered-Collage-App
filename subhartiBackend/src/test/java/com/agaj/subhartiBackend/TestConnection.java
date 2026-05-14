package com.agaj.subhartiBackend;
import java.net.URL;

public class TestConnection {
    public static void main(String[] args) {
        try {
            new URL("https://www.google.com").openConnection().connect();
            System.out.println("Connected to Google");
        } catch (Exception e) {
            System.out.println("Connection Failed");
            e.printStackTrace();
        }
    }
}