Approach to the problem
Problem 1 --> the products when added to cart should be visible to user even if the user is not logged in
solution and approach --> used localstorage for it so that even if the page is refreshed, it fetch the products from localstorage and render it
                      --> when guest user add to the product to cart it gets updated to localstorage and then get rendered

Problem 2 ---> only when the user is logged in, then user's previously added products can be seen
solution and approach --> added authentication middleware and built and authorizing api for users so that only when user is logged it ,his/her data can be accessed

Problem 3 ---> when guest adds to cart and try to checkout it redirects him to signin ,after sign in the guest cart should be merged with user's cart
               so that products added to cart before login can also be seen.
Solution and approach --> when user logs in a api is called with the guest-cart's products in localstorage which get merged with the user's cart 
                          and the total products (previously + new) is rendered on screen (api specially to handled this edge case).
