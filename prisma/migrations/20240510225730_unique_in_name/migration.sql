/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Ranking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ranking_name_key" ON "Ranking"("name");
