-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('SUPERADMIN', 'ADMIN', 'DOCTOR', 'PATEINTS');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."BookDoctorStatus" AS ENUM ('PENDING', 'PROCESS', 'SUCCESS', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."PaymentType" AS ENUM ('CASH', 'CARD');

-- CreateEnum
CREATE TYPE "public"."CardType" AS ENUM ('UZCARD', 'HUMO', 'VISA', 'MASTERCARD');

-- CreateEnum
CREATE TYPE "public"."ChatRating" AS ENUM ('R1', 'R2', 'R3', 'R4', 'R5');

-- CreateEnum
CREATE TYPE "public"."ComplaintType" AS ENUM ('COMMENT', 'REVIEW', 'CHAT', 'COMPLAINT', 'REASON');

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3),
    "hashedPassword" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "location" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "role" "public"."Role" NOT NULL DEFAULT 'DOCTOR',
    "servicesId" INTEGER NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pateints" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "role" "public"."Role" NOT NULL DEFAULT 'PATEINTS',

    CONSTRAINT "Pateints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoctorDocument" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "passportUrl" TEXT NOT NULL,
    "diplomUrl" TEXT NOT NULL,
    "certificateUrl" TEXT NOT NULL,
    "selfEmploymentUrl" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "doctorId" INTEGER NOT NULL,

    CONSTRAINT "DoctorDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "doctorDocumentId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Speciality" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "rating" "public"."ChatRating" NOT NULL,
    "comments" TEXT NOT NULL,
    "complaint" "public"."ComplaintType" NOT NULL DEFAULT 'CHAT',
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "pateintsId" INTEGER NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Wallet" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "cardNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "type" "public"."CardType" NOT NULL DEFAULT 'HUMO',
    "date" TEXT NOT NULL,
    "cvv" INTEGER,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "doctorId" INTEGER,
    "pateintsId" INTEGER,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookDoctor" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "bookDate" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "status" "public"."BookDoctorStatus" NOT NULL DEFAULT 'PENDING',
    "location" TEXT NOT NULL,
    "serviceID" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "specialityId" INTEGER NOT NULL,
    "pateintsId" INTEGER NOT NULL,

    CONSTRAINT "BookDoctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "status" "public"."PaymentStatus" NOT NULL,
    "pateintsName" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "paymentType" "public"."PaymentType" NOT NULL DEFAULT 'CARD',
    "meetingDate" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "doctorBookId" INTEGER NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookDoctorTime" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "timeDeleted" TIMESTAMP(3) NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "finishTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BookDoctorTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_DoctorToSpeciality" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DoctorToSpeciality_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_BookDoctorTimeToDoctor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BookDoctorTimeToDoctor_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "public"."Admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phoneNumber_key" ON "public"."Admin"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phoneNumber_key" ON "public"."Doctor"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Pateints_phoneNumber_key" ON "public"."Pateints"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_name_key" ON "public"."Speciality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_cardNumber_key" ON "public"."Wallet"("cardNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_phoneNumber_key" ON "public"."Wallet"("phoneNumber");

-- CreateIndex
CREATE INDEX "_DoctorToSpeciality_B_index" ON "public"."_DoctorToSpeciality"("B");

-- CreateIndex
CREATE INDEX "_BookDoctorTimeToDoctor_B_index" ON "public"."_BookDoctorTimeToDoctor"("B");

-- AddForeignKey
ALTER TABLE "public"."Doctor" ADD CONSTRAINT "Doctor_servicesId_fkey" FOREIGN KEY ("servicesId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorDocument" ADD CONSTRAINT "DoctorDocument_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_doctorDocumentId_fkey" FOREIGN KEY ("doctorDocumentId") REFERENCES "public"."DoctorDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_pateintsId_fkey" FOREIGN KEY ("pateintsId") REFERENCES "public"."Pateints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Wallet" ADD CONSTRAINT "Wallet_pateintsId_fkey" FOREIGN KEY ("pateintsId") REFERENCES "public"."Pateints"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookDoctor" ADD CONSTRAINT "BookDoctor_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookDoctor" ADD CONSTRAINT "BookDoctor_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookDoctor" ADD CONSTRAINT "BookDoctor_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "public"."Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookDoctor" ADD CONSTRAINT "BookDoctor_pateintsId_fkey" FOREIGN KEY ("pateintsId") REFERENCES "public"."Pateints"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_doctorBookId_fkey" FOREIGN KEY ("doctorBookId") REFERENCES "public"."BookDoctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DoctorToSpeciality" ADD CONSTRAINT "_DoctorToSpeciality_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DoctorToSpeciality" ADD CONSTRAINT "_DoctorToSpeciality_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BookDoctorTimeToDoctor" ADD CONSTRAINT "_BookDoctorTimeToDoctor_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."BookDoctorTime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_BookDoctorTimeToDoctor" ADD CONSTRAINT "_BookDoctorTimeToDoctor_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
