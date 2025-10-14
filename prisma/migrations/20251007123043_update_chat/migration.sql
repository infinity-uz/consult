-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_pateintsId_fkey";

-- AlterTable
ALTER TABLE "public"."Chat" ALTER COLUMN "rating" DROP NOT NULL,
ALTER COLUMN "fromUserRole" DROP NOT NULL,
ALTER COLUMN "fromUserId" DROP NOT NULL,
ALTER COLUMN "toUserRole" DROP NOT NULL,
ALTER COLUMN "toUserId" DROP NOT NULL,
ALTER COLUMN "doctorId" DROP NOT NULL,
ALTER COLUMN "pateintsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Chat" ADD CONSTRAINT "Chat_pateintsId_fkey" FOREIGN KEY ("pateintsId") REFERENCES "public"."Pateints"("id") ON DELETE SET NULL ON UPDATE CASCADE;
