-- CreateTable
CREATE TABLE "MenuFile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "week" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuFile_week_key" ON "MenuFile"("week");
