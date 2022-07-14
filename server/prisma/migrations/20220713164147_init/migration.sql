-- CreateTable
CREATE TABLE "chat" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "chatId" INT8 NOT NULL,
    "fromId" STRING NOT NULL,
    "toId" STRING NOT NULL,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_chat-relation" (
    "A" INT8 NOT NULL,
    "B" STRING NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_chat-relation_AB_unique" ON "_chat-relation"("A", "B");

-- CreateIndex
CREATE INDEX "_chat-relation_B_index" ON "_chat-relation"("B");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_toId_fkey" FOREIGN KEY ("toId") REFERENCES "user"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chat-relation" ADD CONSTRAINT "_chat-relation_A_fkey" FOREIGN KEY ("A") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chat-relation" ADD CONSTRAINT "_chat-relation_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("username") ON DELETE CASCADE ON UPDATE CASCADE;
