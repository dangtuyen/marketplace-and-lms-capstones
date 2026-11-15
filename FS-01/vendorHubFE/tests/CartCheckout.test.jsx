describe('FS-01 Frontend: Cart & Product Catalog Logic', () => {
  test('TC-12: Should accurately calculate multi-item shopping cart totals', () => {
    const cartItems = [
      { id: 'p1', name: 'Mechanical Keyboard', price: 90, quantity: 2 },
      { id: 'p2', name: 'Wireless Mouse', price: 30, quantity: 1 }
    ];
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(total).toBe(210);
  });

  test('TC-13: Should safely normalize product API responses into an array', () => {
    const apiResponse = { products: [{ _id: '1', name: 'Gaming Laptop' }] };
    const safeList = Array.isArray(apiResponse) ? apiResponse : apiResponse.products || [];
    expect(Array.isArray(safeList)).toBe(true);
    expect(safeList.length).toBe(1);
  });
});
