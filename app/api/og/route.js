import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1f2937',
            backgroundImage: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
                fontSize: '48px',
                fontWeight: 'bold',
                color: 'white',
              }}
            >
              JB
            </div>
            
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 16px 0',
                lineHeight: '1.1',
              }}
            >
              Jason Bahil
            </h1>
            
            <p
              style={{
                fontSize: '32px',
                color: '#9ca3af',
                margin: '0 0 24px 0',
                fontWeight: '500',
              }}
            >
              Web Developer / ICT Unit Head
            </p>
            
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '24px',
              }}
            >
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                React
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                Next.js
              </div>
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#059669',
                  borderRadius: '20px',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                }}
              >
                Node.js
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Error generating OG image:', error)
    return new Response('Failed to generate image', { status: 500 })
  }
}
