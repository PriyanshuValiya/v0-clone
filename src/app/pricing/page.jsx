"use client";

import React, { useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { SidebarContext } from "@/context/sidebarContext";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const pricingCards = [
  {
    title: "Plus",
    token: 10,
    desc: "Model for small team or group who are just started",
    price: 20,
  },
  {
    title: "Pro",
    token: 25,
    desc: "Model for small team or group who are just started",
    price: 50,
  },
  {
    title: "Premium",
    token: 50,
    desc: "Model for small team or group who are just started",
    price: 100,
  },
  {
    title: "Platinum",
    token: 120,
    desc: "Model for small team or group who are just started",
    price: 200,
  },
];

function PricingPage() {
  const { open, setOpen } = useContext(SidebarContext);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setOpen(false);
  }, []);

  const handleOnSuccess = () => {
    toast({
      title: "✅ Payment Successfull",
    });
    router.push("/");
  };

  return (
    <div
      className={`flex flex-col items-center ${
        open ? "justify-center px-8" : "px-20"
      }`}
    >
      <div className="mt-5 text-center font-sans">
        <h2 className="font-bold text-5xl">Pricing Section</h2>
        <p className="text-gray-400 mt-4 max-w-2xl">
          Get started with our Plus model and boost your development journey
          faster.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {pricingCards.map((card, index) => (
          <Card
            key={index}
            className="h-[330px] border hover:border-gray-600 font-sans"
          >
            <CardHeader>
              <CardTitle className="text-3xl">{card.title}</CardTitle>
              <CardDescription className="mt-2">{card.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mt-5">
                <span className="text-4xl font-bold">&#8377;{card.price}</span>
                <p className="text-gray-400 text-sm ml-2">/month</p>
              </div>
              <div className="mt-5">
                <span className="text-2xl font-bold">{card.token}</span>
                <span className="text-gray-400"> tokens</span>
              </div>
            </CardContent>
            <CardFooter>
              <button className="flex justify-center gap-x-5 w-full bg-yellow-500 text-black py-2 rounded-md">
                <CreditCard size={30} />
                <PayPalButtons
                  className="bg-yellow-500"
                  style={{ layout: "horizontal" }}
                  onApprove={handleOnSuccess}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: pricingCards[index].price,
                            currency_code: "USD", // USD
                          },
                        },
                      ],
                    });
                  }}
                />
                {/* </p> */}
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
