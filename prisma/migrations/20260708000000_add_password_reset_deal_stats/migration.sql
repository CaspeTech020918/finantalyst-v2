-- Add views counter to DealListing
ALTER TABLE "DealListing" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;

-- Add wantsContact flag to InvestmentInterest
ALTER TABLE "InvestmentInterest" ADD COLUMN "wantsContact" BOOLEAN NOT NULL DEFAULT false;

-- Create PasswordResetToken table
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- Unique token index
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- User index on reset tokens
CREATE INDEX "PasswordResetToken_userId_idx" ON "PasswordResetToken"("userId");

-- Foreign key: token → user
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
