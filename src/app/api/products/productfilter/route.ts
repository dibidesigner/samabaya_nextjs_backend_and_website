import { NextRequest } from 'next/server';


const products = [
  { id: 1, name: 'iPhone 15', category: 'mobile' },
  { id: 2, name: 'MacBook Pro', category: 'laptop' },
  { id: 3, name: 'Galaxy S22', category: 'mobile' },
  { id: 4, name: 'Dell XPS 13', category: 'laptop' },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get('category'); 
  const keyword = searchParams.get('search');   

  let filtered = products;

  if (category) {
    filtered = filtered.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (keyword) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  return Response.json({ success: true, data: filtered });
}
