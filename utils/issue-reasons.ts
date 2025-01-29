export const ISSUE_TYPES = [
    {
      value: "ORDER",
      subCategory: [
        {
          value: "Order not recieved",
          enums: "ORD01",
        },
        {
          value: "Quality issue",
          enums: "ORD02",
        },
        {
          value: "Delayed delivery",
          enums: "ORD03",
        },
        {
          value: "Invoice missing",
          enums: "ORD04",
        },
        {
          value: "Store not responsive",
          enums: "ORD05",
        },
      ],
    },
    {
      value: "ITEM",
      subCategory: [
        {
          value: "Missing items",
          enums: "ITM01",
        },
        {
          value: "Quantity issue",
          enums: "ITM02",
        },
        {
          value: "Item mismatch",
          enums: "ITM03",
        },
        {
          value: "Quality issue",
          enums: "ITM04",
        },
        {
          value: "Expired item",
          enums: "ITM05",
        },
        {
          value: "Incorrectly marked as returned",
          enums: "ITM06",
        },
      ],
    },
    {
      value: "FULFILLMENT",
      subCategory: [
        {
          value: "Wrong delivery address",
          enums: "FLM01",
        },
        {
          value: "Delay in delivery",
          enums: "FLM02",
        },
        {
          value: "Delayed delivery",
          enums: "FLM03",
        },
        {
          value: "Improper packaging",
          enums: "FLM04",
        },
        {
          value: "Improper packaging",
          enums: "FLM05",
        },
        {
          value: "Package info mismatch",
          enums: "FLM07",
        },
        {
          value: "Incorrectly marked as delivered",
          enums: "FLM08",
        },
      ],
    },
    {
      value: "AGENT",
      subCategory: [
        {
          value: "Agent behavioral issue",
          enums: "AGT01",
        },
      ],
    },
    {
      value: "PAYMENT",
      subCategory: [
        {
          value: "Refund not received",
          enums: "PTM01",
        },
        {
          value: "Underpaid",
          enums: "PTM02",
        },
        {
          value: "Over paid",
          enums: "PTM03",
        },
        {
          value: "Not paid",
          enums: "PTM04",
        },
      ],
    },
];
  