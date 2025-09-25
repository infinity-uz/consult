CREATE TABLE `admin`(
    `id` CHAR(36) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `hashed_password` VARCHAR(255) NOT NULL,
    `role` ENUM('SuperAdmin') NOT NULL DEFAULT 'Admin',
    `is_active` BOOLEAN NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `doctor`(
    `speciality` VARCHAR(255) NOT NULL,
    `services` CHAR(36) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `age` INT NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `hashed_password` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `role` ENUM('') NOT NULL DEFAULT 'Doctor',
    `id` CHAR(36) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `pateints`(
    `id` CHAR(36) NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `age` INT NOT NULL,
    `role` ENUM('') NOT NULL DEFAULT 'Pateint',
    `hashed_password` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `doctor_document`(
    `id` CHAR(36) NOT NULL,
    `doctor_id` CHAR(36) NOT NULL,
    `passport_url` VARCHAR(255) NOT NULL,
    `diplom_url` VARCHAR(255) NOT NULL,
    `certificate_url` VARCHAR(255) NOT NULL,
    `self_employment_url` VARCHAR(255) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `wallet`(
    `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `card_number` VARCHAR(255) NOT NULL,
    `type` ENUM('Uzcard', 'Humo', 'Visa', 'MasterCard') NOT NULL,
    `date` DATE NOT NULL,
    `cvv` INT NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `speciality`(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `description` TEXT NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `book_doctor`(
    `service_id` CHAR(36) NOT NULL,
    `doctor_id` CHAR(36) NOT NULL,
    `speciality_id` CHAR(36) NOT NULL,
    `pateints_id` CHAR(36) NOT NULL,
    `book_date` DATE NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `status` ENUM(
        'Pending',
        'Process',
        'Success',
        'Cancelled'
    ) NOT NULL DEFAULT 'Pending',
    `location` VARCHAR(255) NOT NULL,
    `id` CHAR(36) NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `doctor_book_time`(
    `id` CHAR(36) NOT NULL,
    `date` DATE NOT NULL,
    `start_time` TIME NOT NULL,
    `finish_time` TIME NOT NULL,
    `doctor_id` CHAR(36) NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `chat`(
    `id` CHAR(36) NOT NULL,
    `doctor_id` CHAR(36) NOT NULL,
    `pateint_id` CHAR(36) NOT NULL,
    `rating` ENUM('1', '2', '3', '4', '5') NOT NULL,
    `comments` VARCHAR(255) NOT NULL,
    `complaint` ENUM('comments') NOT NULL DEFAULT 'comments',
    PRIMARY KEY(`id`)
);
CREATE TABLE `payment`(
    `id` CHAR(36) NOT NULL,
    `book_doctor_id` CHAR(36) NOT NULL,
    `status` ENUM('Pending', 'Paid', 'Cancelled') NOT NULL,
    `pateints_name` VARCHAR(255) NOT NULL,
    `doctor_name` VARCHAR(255) NOT NULL,
    `payment_type` ENUM('Cash', 'Card') NOT NULL,
    `meeting_date` DATETIME NOT NULL,
    `description` BIGINT NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `service`(
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `description` TEXT NOT NULL,
    PRIMARY KEY(`id`)
);
CREATE TABLE `image`(
    `id` CHAR(36) NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `doctor_document_id` CHAR(36) NOT NULL,
    PRIMARY KEY(`id`)
);
ALTER TABLE
    `wallet` ADD CONSTRAINT `wallet_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `pateints`(`id`);
ALTER TABLE
    `doctor` ADD CONSTRAINT `doctor_services_foreign` FOREIGN KEY(`services`) REFERENCES `service`(`id`);
ALTER TABLE
    `doctor_document` ADD CONSTRAINT `doctor_document_doctor_id_foreign` FOREIGN KEY(`doctor_id`) REFERENCES `doctor`(`id`);
ALTER TABLE
    `image` ADD CONSTRAINT `image_doctor_document_id_foreign` FOREIGN KEY(`doctor_document_id`) REFERENCES `doctor_document`(`id`);
ALTER TABLE
    `wallet` ADD CONSTRAINT `wallet_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `doctor`(`id`);
ALTER TABLE
    `chat` ADD CONSTRAINT `chat_pateint_id_foreign` FOREIGN KEY(`pateint_id`) REFERENCES `pateints`(`id`);
ALTER TABLE
    `book_doctor` ADD CONSTRAINT `book_doctor_speciality_id_foreign` FOREIGN KEY(`speciality_id`) REFERENCES `speciality`(`id`);
ALTER TABLE
    `book_doctor` ADD CONSTRAINT `book_doctor_doctor_id_foreign` FOREIGN KEY(`doctor_id`) REFERENCES `doctor`(`id`);
ALTER TABLE
    `doctor_book_time` ADD CONSTRAINT `doctor_book_time_doctor_id_foreign` FOREIGN KEY(`doctor_id`) REFERENCES `doctor`(`id`);
ALTER TABLE
    `doctor` ADD CONSTRAINT `doctor_speciality_foreign` FOREIGN KEY(`speciality`) REFERENCES `speciality`(`id`);
ALTER TABLE
    `book_doctor` ADD CONSTRAINT `book_doctor_service_id_foreign` FOREIGN KEY(`service_id`) REFERENCES `service`(`id`);
ALTER TABLE
    `chat` ADD CONSTRAINT `chat_doctor_id_foreign` FOREIGN KEY(`doctor_id`) REFERENCES `doctor`(`id`);
ALTER TABLE
    `payment` ADD CONSTRAINT `payment_book_doctor_id_foreign` FOREIGN KEY(`book_doctor_id`) REFERENCES `book_doctor`(`id`);
ALTER TABLE
    `book_doctor` ADD CONSTRAINT `book_doctor_pateints_id_foreign` FOREIGN KEY(`pateints_id`) REFERENCES `pateints`(`id`);