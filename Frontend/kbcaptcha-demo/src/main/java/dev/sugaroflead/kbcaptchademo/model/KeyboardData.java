package dev.sugaroflead.kbcaptchademo.model;

//     # key_held_avg 
//     # std_dev_held_time 
//     # key_stroke_time_avg  -- key_stroke_median
//     # std_dev_stroke_delay -- key_stroke_IQR
//     # overlap_percent
//     # backspace_percent -- Deprecated

public class KeyboardData {
    public double key_held_avg;
    public double std_dev_held_time;
    public double key_stroke_delay_median;
    public double key_stroke_IQR;
    public double overlap_percent;
    public double backspace_percent;
}