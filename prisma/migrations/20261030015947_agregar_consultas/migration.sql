-- CreateTable
CREATE TABLE "Consulta" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
