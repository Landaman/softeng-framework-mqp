-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SanitationRequest" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,

    CONSTRAINT "SanitationRequest_pkey" PRIMARY KEY ("id")
);
