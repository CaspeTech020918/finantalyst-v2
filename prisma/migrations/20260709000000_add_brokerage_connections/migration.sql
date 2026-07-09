-- Add BrokerageConnection table for Phase 2 account linking
CREATE TABLE "BrokerageConnection" (
    "id"           TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "broker"       TEXT NOT NULL,
    "clientId"     TEXT,
    "accessToken"  TEXT,
    "refreshToken" TEXT,
    "expiresAt"    TIMESTAMP(3),
    "isActive"     BOOLEAN NOT NULL DEFAULT true,
    "connectedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrokerageConnection_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BrokerageConnection_userId_broker_key" ON "BrokerageConnection"("userId", "broker");
CREATE INDEX "BrokerageConnection_userId_idx" ON "BrokerageConnection"("userId");

ALTER TABLE "BrokerageConnection"
    ADD CONSTRAINT "BrokerageConnection_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
