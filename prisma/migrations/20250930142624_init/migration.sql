/*
  Warnings:

  - You are about to drop the column `from` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `fromUserId` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "fromUserId" INTEGER NOT NULL,
ADD COLUMN     "fromUserRole" "public"."Role" NOT NULL DEFAULT 'PATEINTS',
ADD COLUMN     "toUserId" INTEGER NOT NULL,
ADD COLUMN     "toUserRole" "public"."Role" NOT NULL DEFAULT 'DOCTOR';
