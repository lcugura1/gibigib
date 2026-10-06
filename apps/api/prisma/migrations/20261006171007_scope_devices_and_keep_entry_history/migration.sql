-- CreateEnum
CREATE TYPE "DeviceKind" AS ENUM ('SCANNER', 'DOOR');

-- DropForeignKey
ALTER TABLE "EntryEvent" DROP CONSTRAINT "EntryEvent_userId_fkey";

-- AlterTable: devices created before kinds existed were all scanners
ALTER TABLE "Device" ADD COLUMN "kind" "DeviceKind" NOT NULL DEFAULT 'SCANNER';
ALTER TABLE "Device" ALTER COLUMN "kind" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "DoorCommand_consumedByDeviceId_idx" ON "DoorCommand"("consumedByDeviceId");

-- CreateIndex
CREATE INDEX "EntryEvent_entryTokenId_idx" ON "EntryEvent"("entryTokenId");

-- CreateIndex
CREATE INDEX "EntryEvent_deviceId_idx" ON "EntryEvent"("deviceId");

-- AddForeignKey
ALTER TABLE "EntryEvent" ADD CONSTRAINT "EntryEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
