-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateTable
CREATE TABLE "accomodationDetails" (
    "id" UUID NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNo" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "collegeName" TEXT NOT NULL,
    "paymentVerified" BOOLEAN NOT NULL DEFAULT false,
    "paymentMade" INTEGER NOT NULL,
    "mealLefts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accomodationDetails_pkey" PRIMARY KEY ("id")
);
