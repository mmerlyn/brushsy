import type { RefObject } from 'react';
import type { DrawingStroke, AppState, Point } from '../types/types';


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

// Helper to calculate distance from point to line segment
const distanceToLineSegment = (p: Point, v: Point, w: Point): number => {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.sqrt((p.x - v.x) ** 2 + (p.y - v.y) ** 2);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = v.x + t * (w.x - v.x);
    const projY = v.y + t * (w.y - v.y);
    return Math.sqrt((p.x - projX) ** 2 + (p.y - projY) ** 2);
};

// Hit test to find stroke at a point
export const hitTestStroke = (point: Point, strokes: DrawingStroke[], threshold: number = 10): DrawingStroke | null => {
    // Iterate in reverse to select top-most strokes first
    for (let i = strokes.length - 1; i >= 0; i--) {
        const stroke = strokes[i];
        if (stroke.points.length === 0) continue;

        const hitThreshold = Math.max(threshold, stroke.size / 2 + 5);

        if (stroke.tool === 'brush' || stroke.tool === 'eraser' || stroke.tool === 'line') {
            // Check distance to each line segment
            for (let j = 0; j < stroke.points.length - 1; j++) {
                const dist = distanceToLineSegment(point, stroke.points[j], stroke.points[j + 1]);
                if (dist <= hitThreshold) return stroke;
            }
            // Also check first point for single-point strokes
            if (stroke.points.length === 1) {
                const dist = Math.sqrt((point.x - stroke.points[0].x) ** 2 + (point.y - stroke.points[0].y) ** 2);
                if (dist <= hitThreshold) return stroke;
            }
        } else if (stroke.tool === 'rectangle' && stroke.points.length > 1) {
            const start = stroke.points[0];
            const end = stroke.points[stroke.points.length - 1];
            const minX = Math.min(start.x, end.x) - hitThreshold;
            const maxX = Math.max(start.x, end.x) + hitThreshold;
            const minY = Math.min(start.y, end.y) - hitThreshold;
            const maxY = Math.max(start.y, end.y) + hitThreshold;

            // Check if near any edge of the rectangle
            if (point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY) {
                const innerMinX = Math.min(start.x, end.x) + hitThreshold;
                const innerMaxX = Math.max(start.x, end.x) - hitThreshold;
                const innerMinY = Math.min(start.y, end.y) + hitThreshold;
                const innerMaxY = Math.max(start.y, end.y) - hitThreshold;

                // Not inside the inner rectangle (i.e., near the edge)
                if (!(point.x > innerMinX && point.x < innerMaxX && point.y > innerMinY && point.y < innerMaxY)) {
                    return stroke;
                }
            }
        } else if (stroke.tool === 'circle' && stroke.points.length > 1) {
            const center = stroke.points[0];
            const end = stroke.points[stroke.points.length - 1];
            const radius = Math.sqrt((end.x - center.x) ** 2 + (end.y - center.y) ** 2);
            const distFromCenter = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);

            // Check if near the circle's edge
            if (Math.abs(distFromCenter - radius) <= hitThreshold) {
                return stroke;
            }
        }
    }
    return null;
};

// Draw selection highlight around a stroke
export const drawSelectionHighlight = (ctx: CanvasRenderingContext2D, stroke: DrawingStroke) => {
    if (!stroke || stroke.points.length === 0) return;

    ctx.save();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);

    if (stroke.tool === 'rectangle' && stroke.points.length > 1) {
        const start = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];
        const padding = 5;
        ctx.strokeRect(
            Math.min(start.x, end.x) - padding,
            Math.min(start.y, end.y) - padding,
            Math.abs(end.x - start.x) + padding * 2,
            Math.abs(end.y - start.y) + padding * 2
        );
    } else if (stroke.tool === 'circle' && stroke.points.length > 1) {
        const center = stroke.points[0];
        const end = stroke.points[stroke.points.length - 1];
        const radius = Math.sqrt((end.x - center.x) ** 2 + (end.y - center.y) ** 2);
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius + 5, 0, 2 * Math.PI);
        ctx.stroke();
    } else {
        // For brush, eraser, line - draw bounding box
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        stroke.points.forEach(p => {
            minX = Math.min(minX, p.x);
            minY = Math.min(minY, p.y);
            maxX = Math.max(maxX, p.x);
            maxY = Math.max(maxY, p.y);
        });
        const padding = stroke.size / 2 + 5;
        ctx.strokeRect(minX - padding, minY - padding, maxX - minX + padding * 2, maxY - minY + padding * 2);
    }

    ctx.restore();
};