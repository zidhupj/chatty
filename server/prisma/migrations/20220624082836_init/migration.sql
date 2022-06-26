-- CreateTable
CREATE TABLE "user" (
    "username" STRING NOT NULL,
    "email" STRING,
    "phone" STRING,
    "name" STRING NOT NULL,
    "dateOfBirth" TIMESTAMPTZ(0) NOT NULL,
    "avatar" STRING,

    CONSTRAINT "primary" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "_userContacts" (
    "A" STRING NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "_userContacts_AB_unique" ON "_userContacts"("A", "B");

-- CreateIndex
CREATE INDEX "_userContacts_B_index" ON "_userContacts"("B");

-- AddForeignKey
ALTER TABLE "_userContacts" ADD CONSTRAINT "_userContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("username") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userContacts" ADD CONSTRAINT "_userContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("username") ON DELETE CASCADE ON UPDATE CASCADE;
