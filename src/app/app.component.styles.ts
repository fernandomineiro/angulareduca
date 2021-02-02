export const red = '#F44336';
export const green = '#4CAF50';
export const blue = '#2196F3';

export const styles = {
    title: {
        textAlign: 'center',
        backgroundColor: '#E0E0E0',
        '&:hover': {
            backgroundColor: '#BDBDBD'
        }
    },
    area: {
        width: '100%',
        height: '10rem',
        color: 'white',
        backgroundColor: data => data.area.backgroundColor
    }
};
