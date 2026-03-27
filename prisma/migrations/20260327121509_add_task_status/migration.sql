-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'PROGRESS', 'DONE', 'CANCELLED');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "status" "TaskStatus" NOT NULL DEFAULT 'PENDING';
