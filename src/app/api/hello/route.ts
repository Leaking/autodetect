import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}

export async function POST(request: Request) {
  const data = await request.json()
  return NextResponse.json({ message: '收到数据', data })
}
