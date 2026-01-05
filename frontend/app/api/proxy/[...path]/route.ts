import { env } from '@/env.mjs';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = env.BACKEND_API_URL || process.env.BACKEND_API_URL || 'http://localhost:4000';

/**
 * API Proxy Route Handler
 * Proxies all requests to the backend API, hiding the backend URL from the client
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleProxyRequest(request, params, 'DELETE');
}

async function handleProxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/api/${pathString}${searchParams ? `?${searchParams}` : ''}`;

    // Get all cookies from the request
    const cookies = request.headers.get('cookie') || '';

    // Prepare headers - forward important headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Forward cookies
    if (cookies) {
      headers['Cookie'] = cookies;
    }

    // Get request body if it exists
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch {
        // No body
      }
    }

    // Forward the request to the backend
    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'include', // Important for cookies
    });

    // Get response data
    const responseText = await response.text();
    let jsonData: any;
    try {
      jsonData = JSON.parse(responseText);
    } catch {
      jsonData = { success: false, error: 'Invalid JSON response', data: responseText };
    }

    // Forward response headers (especially cookies)
    const responseHeaders = new Headers();
    
    // Forward set-cookie headers
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      responseHeaders.set('set-cookie', setCookieHeader);
    }

    // Forward other important headers
    const contentType = response.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    // Return the response with proper status
    return NextResponse.json(jsonData, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error',
        message: 'Failed to connect to backend server'
      },
      { status: 500 }
    );
  }
}

