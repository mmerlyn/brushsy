import type { RefObject } from 'react';
import type { DrawingStroke, AppState } from '../types/types';


export const drawStroke = (ctx: CanvasRenderingContext2D, stroke: DrawingStroke, isDarkTheme: boolean) => {
    if (!stroke || stroke.points.length < 1) return;
    ctx.save();
    ctx.globalAlpha = stroke.opacity / 100;
    ctx.strokeStyle = stroke.tool === 'eraser' ? (isDarkTheme ? '#121212' : '#ffffff') : stroke.color;
    ctx.lineWidth = stroke.size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if ((stroke.tool === 'brush' || stroke.tool === 'eraser') && stroke.points.length > 1) {
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        for (let i = 1; i < stroke.points.length - 1; i++) {
            const p1 = stroke.points[i];
            const p2 = stroke.points[i + 1];
            const midPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
            ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
        }
        const last = stroke.points[stroke.points.length - 1];
        ctx.lineTo(last.x, last.y);
    } else if (stroke.tool === 'rectangle' && stroke.points.length > 1) {
        const start = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];
        ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    } else if (stroke.tool === 'circle' && stroke.points.length > 1) {
        const start = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];
        const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    } else if (stroke.tool === 'line' && stroke.points.length > 1) {
        const start = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
    }
    ctx.stroke();
    ctx.restore();
};

export const redrawCanvas = (
    pageIndex: number,
    canvasRefs: RefObject<(HTMLCanvasElement | null)[]>,
    overlayCanvasRefs: RefObject<(HTMLCanvasElement | null)[]>,
    state: AppState,
    canvasWidth: number,
    canvasHeight: number,
    clearOverlay: boolean = true
) => {
    const canvas = canvasRefs.current[pageIndex];
    const overlayCanvas = overlayCanvasRefs.current[pageIndex];
    if (!canvas || !overlayCanvas) return;

    const ctx = canvas.getContext('2d');
    const overlayCtx = overlayCanvas.getContext('2d');
    if (!ctx || !overlayCtx) return;

    const page = state.pages[pageIndex];
    if (!page) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (clearOverlay) overlayCtx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = state.isDarkTheme ? '#121212' : '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    page.strokes.forEach(stroke => drawStroke(ctx, stroke, state.isDarkTheme));

    if (state.showGrid) {
        ctx.strokeStyle = state.isDarkTheme ? '#2a2a2a' : '#f0f0f0';
        ctx.lineWidth = 0.5;
        const gridSize = 20;
        for (let x = 0; x <= canvasWidth; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
            ctx.stroke();
        }
        for (let y = 0; y <= canvasHeight; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    }
};