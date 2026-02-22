import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sizeAttr = searchParams.get('size') || '512';
    const size = parseInt(sizeAttr, 10);

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #171717 100%)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: size * 0.1,
                }}
            >
                {/* Outer Gold Ring */}
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '25%', // Squircle-like for icons
                        border: `${size * 0.02}px solid #D4AF37`,
                        boxShadow: `inset 0 0 ${size * 0.1}px rgba(212, 175, 55, 0.2), 0 0 ${size * 0.1}px rgba(212, 175, 55, 0.1)`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: size * 0.45,
                            color: '#e2cd77',
                            fontFamily: 'serif',
                            fontWeight: '600',
                            lineHeight: 0.9,
                            letterSpacing: '-0.02em',
                            textShadow: `0 4px ${size * 0.05}px rgba(0,0,0,0.5)`,
                        }}
                    >
                        EP
                    </div>
                </div>
            </div>
        ),
        {
            width: size,
            height: size,
        }
    );
}
