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
                    background: '#0E0E0E',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        fontSize: size * 0.6,
                        color: '#D4AF37',
                        fontFamily: 'sans-serif',
                        fontWeight: '900',
                        lineHeight: 0.8,
                        letterSpacing: '-0.05em'
                    }}
                >
                    EP
                </div>
                <div
                    style={{
                        fontSize: size * 0.15,
                        color: '#D4AF37',
                        fontFamily: 'monospace',
                        marginTop: size * 0.05,
                        letterSpacing: '0.2em',
                        opacity: 0.8
                    }}
                >
                    OS
                </div>
            </div>
        ),
        {
            width: size,
            height: size,
        }
    );
}
