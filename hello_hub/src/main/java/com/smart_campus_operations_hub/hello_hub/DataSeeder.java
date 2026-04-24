package com.smart_campus_operations_hub.hello_hub;

import com.smart_campus_operations_hub.hello_hub.model.Resource;
import com.smart_campus_operations_hub.hello_hub.model.ResourceStatus;
import com.smart_campus_operations_hub.hello_hub.repository.ResourceRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final ResourceRepository resourceRepository;

    @PostConstruct
    public void seed() {
        if (!resourceRepository.existsByName("Computer Lab 01 (Advanced Computing)")) {
            System.out.println(">> DataSeeder: Required labs missing. Seeding resources...");

            Resource res1 = Resource.builder()
                    .name("Computer Lab 01 (Advanced Computing)")
                    .type("LAB")
                    .status(ResourceStatus.AVAILABLE)
                    .description("High-performance computing lab for research.")
                    .build();

            Resource res2 = Resource.builder().name("Computer Lab 02 (Network & Security)").type("LAB").status(ResourceStatus.AVAILABLE).build();
            Resource res3 = Resource.builder().name("Main Conference Hall").type("CONFERENCE_ROOM").status(ResourceStatus.AVAILABLE).build();
            Resource res4 = Resource.builder().name("Advanced Robotics & AI Lab").type("LAB").status(ResourceStatus.AVAILABLE).build();
            Resource res5 = Resource.builder().name("Multimedia Production Studio").type("LAB").status(ResourceStatus.AVAILABLE).build();
            Resource res6 = Resource.builder().name("IoT Innovation Center").type("LAB").status(ResourceStatus.AVAILABLE).build();
            Resource res7 = Resource.builder().name("Virtual Reality (VR) Lab").type("LAB").status(ResourceStatus.AVAILABLE).build();

            Resource inv1 = Resource.builder().name("MacBook Pro #04").type("LAPTOP").status(ResourceStatus.AVAILABLE).build();
            Resource inv2 = Resource.builder().name("Sony 4K Projector - Unit 2").type("PROJECTOR").status(ResourceStatus.AVAILABLE).build();

            resourceRepository.saveAll(Arrays.asList(res1, res2, res3, res4, res5, res6, res7, inv1, inv2));
            System.out.println(">> DataSeeder: Labs and equipment seeded successfully!");
        } else {
            System.out.println(">> DataSeeder: Labs already exist. Skipping seed.");
        }
    }
}
