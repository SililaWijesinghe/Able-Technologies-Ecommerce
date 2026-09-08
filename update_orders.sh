#!/bin/bash
awk '/const orderItemsData = cartItems.map\(\(item: any\) => \(\{/ {
    print "        const orderItemsData = cartItems.map((item: any) => {"
    print "            let variantData = null;"
    print "            if (item.variant) {"
    print "                try {"
    print "                    variantData = typeof item.variant === '\''string'\'' ? JSON.parse(item.variant) : item.variant;"
    print "                } catch (e) {"
    print "                    variantData = { raw: item.variant };"
    print "                }"
    print "            }"
    print "            return {"
    print "                order_id: actualOrderId,"
    print "                product_id: item.productId,"
    print "                product_name: item.name,"
    print "                unit_price: item.price,"
    print "                quantity: item.quantity,"
    print "                variant: variantData"
    print "            };"
    print "        });"
    getline
    getline
    getline
    getline
    getline
    getline
    getline
    next
}
{print}' routes/orders.ts > temp.ts && mv temp.ts routes/orders.ts
